'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'breezeService',
	function($scope, $stateParams, $location, Authentication, breezeService) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var entityManager = breezeService.entityManager,
			article = {
				title: this.title,
				content: this.content
			};

			entityManager.createEntity("Article", article);
			entityManager.saveChanges()
				.then(function(response){
					$location.path('articles/' + response._id);
					$scope.title = '';
					$scope.content = '';
				})
				.catch(function(err){
					console.error(err);
				});


			// var article = new Articles({
			// 	title: this.title,
			// 	content: this.content
			// });
			// article.$save(function(response) {
			// 	$location.path('articles/' + response._id);

			// 	$scope.title = '';
			// 	$scope.content = '';
			// }, function(errorResponse) {
			// 	$scope.error = errorResponse.data.message;
			// });
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);