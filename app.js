(
    function(){

        angular.module("MyApp",[])
        .controller("MyController", MyController)
        .directive("foundItems",FoundItems)
        .service("SearchService",SearchService)
        .constant("API", {url:"https://davids-restaurant.herokuapp.com/menu_items.json"});

        MyController.$inject=['SearchService'];
        function MyController(SearchService){
            this.items_retrieved=[];
            this.filtered=[];
            this.item_length=0;
            this.keyword="";
            this.searchTimes=0;
            
            SearchService.downloadData();
            this.search1=function () {
                this.filtered=[];
                SearchService.downloadData();
                this.items_retrieved=SearchService.getItems();
                this.item_length=this.items_retrieved.length;
                this.searchTimes=this.searchTimes+1;

                for (let index = 0; index < this.item_length; index++) {                    
                    if (this.keyword=="") {
                        //this.filtered.push(this.items_retrieved[index]);
                    }else{
                        if ((this.items_retrieved[index].description).includes(this.keyword)) {
                            this.filtered.push(this.items_retrieved[index]);
                        }
                    }
                    
                }
            }
            this.delete=function (index) {
                this.filtered.splice(index,1);
            }
        }
        SearchService.$inject=["API","$http"];
        function SearchService(API, $http){  
            var data=[];     
            var items=[];    
            
            this.downloadData=function(){
                $http({
                    url : API.url
                }).then(function (result) {
                    data.push(result.data.menu_items);
                    items=data[0];
                });
            }
            this.getItems=function(){
                return items;
            }

        }
        

        function FoundItems(){
            return {
                template: '\
                <table style="width:100%;" ng-if="listsRetrieved.length!=0">\
                    <tr>\
                      <th>Name</th>\
                      <th>Short Name</th>\
                      <th>Description</th>\
                      <th></th>\
                    </tr>\
                    <tr ng-repeat="a in listsRetrieved">\
                      <td>{{a.name}}</td>\
                      <td>{{a.short_name}}</td>\
                      <td>{{a.description}}</td>\
                      <td >\
                        <button  class="btn btn-default" ng-click="onRemove({index: $index});">Don\'t want this one!</button>\
                      </td>\
                    </tr>\
                </table>\
                <h2 ng-if="listsRetrieved.length==0 && searchTimes>0" style="color:red;">Nothing Found!</h2>\
                ',
                scope:{
                    listsRetrieved: "=itemList",
                    onRemove: "&",
                    searchTimes: "="
                }
            }
        }
    }
)();