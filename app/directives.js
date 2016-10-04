angular.module('pcCommonDirectives', [])

.directive('pcDropdownInput', pcDropdownInput)


function pcDropdownInput(){
    return{
        scope:{
            myLabel:"@",
            myList:'=',
            mySelect:'=',
            optionclick:'&'
        },

        template:
        '<md-input-container class="md-block" flex-gt-sm="">\
            <label>{{myLabel}}</label>\
                <md-select ng-model="mySelect">\
                    <md-option ng-click="optionclick()(item)" ng-repeat="item in myList" ng-value="item">\
                        {{item}}\
                    </md-option>\
            </md-select>\
        </md-input-container>' 

    }
}
    