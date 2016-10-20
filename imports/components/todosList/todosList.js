import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tasks } from '../../api/tasks.js';
 
import template from './todosList.html';
 
class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);
 
    this.hideCompleted = false;
 
    this.helpers({
      tasks() {
        const selector = {};
 
        // If hide completed is checked, filter tasks
        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }
 
        // Show newest tasks at the top
        return Tasks.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
      }
    })
  }



  addTask(newTask) {
    // Insert a task into the collection
    Tasks.insert({
      text: newTask,
      createdAt: new Date
    });
 
    // Clear form
    this.newTask = '';

    HTTP.call( 'POST', 'http://localhost:31384/', {params:{"name" : "def"}}, function( error, response ) {
      if ( error ) {
        console.log( error );
      } else {
        console.log( response.content );
        /*
         This will return the HTTP response object that looks something like this:
         {
           content: "String of content...",
           data: Array[100], <-- Our actual data lives here. 
           headers: {  Object containing HTTP response headers }
           statusCode: 200
         }
        */
      }
  });

  }

  setChecked(task) {
    // Set the checked property to the opposite of its current value
    Tasks.update(task._id, {
      $set: {
        checked: !task.checked
      },
    });
  }
  


  removeTask(task) {
    Tasks.remove(task._id);
  }

}
 
export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });