angular.module('pcSearch.directives', [])

.directive('searchFilters', searchFilters)


function searchFilters(){
    return{
        scope:false,

        template:
            '<div class="filter-input">\
                <input placeholder="zip code" ng-model="search.zipcode" ng-keypress="search.setCoordinates($event.keyCode)"/>\
                <h4>Category</h4>\
                <select ng-options="item as item for item in search.categories.list " ng-model="search.category" ng-change="search.filterOut(search.category, search.categories )">   \
              </select> \
              <h4>Rating</h4>\
             <select ng-options="item as item for item in search.ratings.list " ng-model="search.rating" ng-change="search.filterOut(search.rating, search.ratings )">        \
              </select> \
            <h4>Class</h4>\
             <select ng-options="item as item for item in search.classes.list " ng-model="search.class"\
              ng-change="search.filterOut(search.class, search.classes )">\
             </select></div>'

    }
}