import angular from 'angular';
import 'bootstrap';
import './free-write.scss';
import './navControls.html';
import './userInfo.html';

// Angular stuff
const app = angular.module('freeWrite', [])
  .controller('FreeWriteController', function FreeWriteController($scope, $http) {

    $scope.currentStory = {
      title: '',
      text: '',
      _id: null
    };
    
    $scope.editTitle = true;
    $scope.isUser = false;
    $scope.displayName = 'bob';
    $scope.blurWorkspace = false;
    $scope.unsavedChanges = false;
  
    $scope.setCurrentStory = story => {
      $scope.currentStory = story;
      $scope.editTitle = false;
      $scope.unsavedChanges = false;
    }
    
    $scope.setNewStory = () => {
      $scope.currentStory = {
        title: '',
        text: '',
        _id: null
      }
      $scope.editTitle = true;
      $scope.unsavedChanges = false;
    };
    
    this.setStoriesList = d => $scope.storiesList = d.data; 
    this.setStoriesListError = err => console.log(err);
    
    $scope.deleteCurrentStory = () => {
      const deleteId = $scope.currentStory._id;
      $scope.setNewStory();
      if (deleteId != null) {
        $http.post('/delete-story', { _id: deleteId }).then(res => {
          $scope.storiesList = $scope.storiesList.filter(s => s._id !== deleteId);
          $scope.storiesList.sort((a, b) => a.title.localeCompare(b.title));
        });        
      }
    }    
    
    $scope.saveCurrentStory = () => {
      if ($scope.editTitle) return false; // Called below
      $http.post('/save-story', $scope.currentStory).then(res => {
        if ($scope.currentStory._id == null && res.data != null) {
          $scope.currentStory._id = res.data;
          $scope.storiesList.push($scope.currentStory);
        }
        $scope.storiesList.sort((a, b) => a.title.localeCompare(b.title));
      });
      $scope.unsavedChanges = false;
    }
    
    $scope.blurClick = () => $scope.blurWorkspace = !$scope.blurWorkspace;
    $scope.toggleEditTitle = () => $scope.editTitle = !$scope.editTitle;
    $scope.blurEditTitle = () => {
      if ($scope.currentStory.title !== '') {
        $scope.editTitle = false;
        $scope.saveCurrentStory();
      }
    }
  
    $http.get('/get-user-stories').then(this.setStoriesList, this.setStoriesListError);  
    $http.get('/authenticate').then(res => {
      $scope.displayName = res.data.name;
      $scope.isUser = res.data.isUser;
    });  
    
    window.onbeforeunload = () => {
      if ($scope.unsavedChanges) return true;
    }    
  });

app.directive('navControls', () => ({ templateUrl: 'navControls.html' }));
app.directive('userInfo', () => ({ templateUrl: 'userInfo.html' }));

app.directive('autoFocus', () => {  
  return (scope, elem, attr) =>  elem[0].focus();
});
