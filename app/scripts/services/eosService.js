'use strict';

function eosServiceAPI($http) {

  var eosAPI = {};

    eosAPI.getGroups = function() {
      return $http({
        method: 'JSONP',
        url: 'http://eosservicetest2:8000/proc/admin/',
        params: {
          'mgm.cmd': 'group',
          'mgm.subcmd': 'ls',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getFileSystems = function() {
      return $http({
        method: 'JSONP',
        url: 'http://eosservicetest2:8000/proc/admin/',
        params: {
          'mgm.cmd': 'fs',
          'mgm.subcmd': 'ls',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getNodes = function() {
      return $http({
        method: 'JSONP',
        url: 'http://eosservicetest2:8000/proc/admin/',
        params: {
          'mgm.cmd': 'node',
          'mgm.subcmd': 'ls',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getSpaces = function() {
      return $http({
        method: 'JSONP',
        url: 'http://eosservicetest2:8000/proc/admin/',
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'ls',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getVersion = function() {
      return $http({
        method: 'JSONP',
        url: 'http://eosservicetest2:8000/proc/user/',
        params: {
          'mgm.cmd': 'version',
          'mgm.option': 'f',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getNsStat = function() {
      return $http({
        method: 'JSONP',
        url: 'http://eosservicetest2:8000/proc/admin/',
        params: {
          'mgm.cmd': 'ns',
          'mgm.subcmd': 'stat',
          'mgm.option': 'm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getSpaceStatus = function() {
      return $http({
        method: 'JSONP',
        url: 'http://eosservicetest2:8000/proc/admin/',
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'status',
          'mgm.space': 'default',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.option': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };
    
    return eosAPI;
}

angular
  .module('urbanApp')
  .factory('eosService', ['$http', eosServiceAPI]);
