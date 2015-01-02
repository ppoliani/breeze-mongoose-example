'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'breezeService',
	function($scope, $stateParams, $location, Authentication, breezeService) {
		var entityManager = breezeService.entityManager;

		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = {
				title: this.title,
				content: this.content,
				userID : $scope.authentication.user._id,
				created: new Date()
			};

			entityManager.createEntity("Article", article);
			entityManager.saveChanges()
				.then(function(response){
					$location.path('articles/' + response.entities[0].id);
					$scope.title = '';
					$scope.content = '';
				})
				.catch(function(err){
					console.error(err);
				});
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
			})
		};

		$scope.find = function() {
			var q = breeze.EntityQuery
				.from('Articles');

			entityManager.executeQuery(q)
				.then(function(response){
					$scope.articles = response.results;
				})
				.catch(function(err){
					console.error(err);
				});
		};

		$scope.findOne = function() {
			entityManager.fetchEntityByKey('Article', $stateParams.articleId, true)
				.then(function(response){
					$scope.article = response.entity;
				})
				.catch(function(err){
					console.error(err);
				})
		};
	}
]);