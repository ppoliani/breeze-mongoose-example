(function(angular){
	'use strict';

	function breezeService($http, breeze, jsonResultsAdapterService){
		 // region Consts

        var SERVICE_ENDPOINT = 'http://localhost:3000',
        	METADATA_ENDPOINT = SERVICE_ENDPOINT + 'breeze/metadata';

        // endregion

        // region Inner Fields

        var
            _entityManager,
            _metadata;

        // endregion


        // region Inner Methods

        /**
         * Starts the configuration process
         * @private
         */
        function _configBreeze(){
            _customizeAjaxAdapter();
            _entityManager = _createEntityManager();
        }

        /**
         * Customizes the breezeJS ajax adapter
         * @private
         */
        function _customizeAjaxAdapter(){
            var ajax = breeze.config.initializeAdapterInstance('ajax', 'angular');

            ajax.setHttp($http);
        }

        /**
         * Creates a new breezeJS entity manager
         * @private
         */
        function _createEntityManager(){
            breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);

            // set custom naming convention
            _getCustomNamingConvention().setAsDefault();

            // define the breeze DataService
            var
                dataService = new breeze.DataService({
                    serviceName: SERVICE_ENDPOINT,
                    hasServerMetadata: false, // don't ask the server for metadata; we'll inject them manually
                    jsonResultsAdapter: jsonResultsAdapterService
                }),

                // create the metadataStore
                metadataStore = new breeze.MetadataStore();

            // import metadata
            metadataStore.importMetadata(_metadata);

            // create a new EntityManager that uses this metadataStore
            return new breeze.EntityManager({
                dataService: dataService,
                metadataStore: metadataStore
            });
        }


        /**
         * Creates a custom naming convention
         * @private
         */
         function _getCustomNamingConvention() {
            var toCamelCase = function(propertyName){
                return propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
            };

            return new breeze.NamingConvention({
                name: 'camelCaseOnBothSides',
                serverPropertyNameToClient: toCamelCase,
                clientPropertyNameToServer: toCamelCase
            });
        }

        /**
         * Fetches the metadata from the back-end
         * @private
         */
        function _readMetadata(){
            return $http.get(METADATA_ENDPOINT);
        }

		/**
         * Performs initialization tasks
         */
        function init(){
	        _readMetadata()
	            .success(function(metadata){
	                logger.info('Metadata Loaded');
	                _metadata = metadata;
	                _configBreeze();
	            })
	            .error(function(msg){
	                logger.error('An error occured' + msg);
	            });
        }        

         /**
         * Creates a new entity of the given type
         * @param type
         * @param value
         */
        function createEntity(type, value){
            if(!_metadata){
                throw new Error('Metadata has not been loaded yet!');
            }

            return _entityManager.createEntity(type, value);
        }


        // endregion

        return {
        	init: init,
            createEntity: createEntity
        }
	}

	angular.module('data').service('breezeService', [
            '$http',
            'breeze',
            'jsonResultsAdapterService',
            breezeService
		]);
})(angular);