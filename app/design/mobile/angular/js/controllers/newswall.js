App.config(function($routeProvider) {

    $routeProvider.when(BASE_URL+"/comment/mobile_list/index/value_id/:value_id", {
        controller: 'NewswallListController',
        templateUrl: BASE_URL+"/comment/mobile_list/template",
        depth: 1
    }).when(BASE_URL+"/comment/mobile_view/index/value_id/:value_id/news_id/:news_id", {
        controller: 'NewswallViewController',
        templateUrl: BASE_URL+"/comment/mobile_view/template",
        depth: 2
    });

}).controller('NewswallListController', function($scope, $http, $routeParams, $window, $location, Connection, News) {

    $scope.$watch("isOnline", function(isOnline) {
        $scope.has_connection = isOnline;
    });

    $scope.is_loading = true;
    $scope.value_id = News.value_id = $routeParams.value_id;

    News.findAll().success(function(data) {
        $scope.collection = data.collection;
        $scope.page_title = data.page_title;
    }).error(function() {

    }).finally(function() {
        $scope.is_loading = false;
    });

    $scope.showItem = function(item) {
        $location.path(item.url);
    }

}).controller('NewswallViewController', function($scope, $http, $routeParams, Connection, News, Answers, Message) {

    $scope.$watch("isOnline", function(isOnline) {
        $scope.has_connection = isOnline;
        if(isOnline) {
            $scope.loadContent();
        }
    });

    $scope.is_loading = false;
    $scope.show_form = false;
    $scope.value_id = News.value_id = Answers.value_id = $routeParams.value_id;
    Answers.news_id = $routeParams.news_id;

    $scope.showError = function(data) {

        if(data && angular.isDefined(data.message)) {
            $scope.message = new Message();
            $scope.message.isError(true)
                .setText(data.message)
                .show()
            ;
        }
    };

    $scope.loadContent = function() {

        $scope.is_loading = true;

        News.find($routeParams.news_id).success(function(news) {
            $scope.news = news;
        }).error($scope.showError).finally(function() {
            $scope.is_loading = false;
        });

        Answers.findAll($routeParams.news_id).success(function(answers) {
            $scope.answers = answers;
        }).error($scope.showError).finally(function() {
            $scope.is_loading = false;
        });

    }

    $scope.addAnswer = function() {
        Answers.add($scope.new_answer).success(function(data) {
            $scope.message = new Message();
            $scope.message.setText(data.message)
                .isError(false)
                .show()
            ;
            $scope.answers.push(data.answer);
            $scope.show_form = false;
            $scope.new_answer = "";
        }).error(this.showError)
        .finally(ajaxComplete);
    }

    $scope.addLike = function() {
        News.addLike($scope.news.id).success(function(data) {
            if(data.success) {
                $scope.news.number_of_likes++;
                $scope.message = new Message();
                $scope.message.setText(data.message)
                    .isError(false)
                    .show()
                ;
            }
        }).error($scope.showError)
        .finally(ajaxComplete);
    }

    $scope.loadContent();




});