/**
 * Custom jsonResultsAdapter for breezeJS
 */
(function (angular) {
    'use strict';

    function jsonResultsAdapterService() {

        // region Inner Methods

        function extractResults(data) {
            var results = data.results.items;
            if (!results) throw new Error("Unable to resolve 'results' property");

            return results;
        }

        function visitNode(node, parseContext, nodeContext) {
            var entityType = node.$type
                ? _getEntityType(node.$type)
                : _getEntityTypeAlt(parseContext.query.resourceName);

            return {
                entityType: entityType
            };
        }

        /**
         * Returns the entity type that is hidden in the
         * given string; This is used when a saveObjectResult is returned
         * @param type
         * @private
         */
        function _getEntityType(type){
            var tokens = type.split(','),
                tokens2 = tokens[0].split('.');

            return tokens2[tokens2.length - 1];
        }

        /**
         * Returns the type of the node based on its resourceName;
         * this is used when geting resources
         * @param resourceName
         * @private
         */
        function _getEntityTypeAlt(resourceName){
            // ToDo: Find a better solution to map the resource name to entity name
            switch(resourceName){
                case 'Articles':
                    return 'Article';
            }
        }

        // endregion

        // region Public API

        return new breeze.JsonResultsAdapter({
            name: 'custom-adapter',
            extractResults: extractResults,
            visitNode: visitNode
        });

        // endregion
    }

    angular.module('data').service('jsonResultsAdapterService', [jsonResultsAdapterService]);

})(angular);