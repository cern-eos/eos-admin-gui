'use strict';

function eosServiceAPI($http) {

  var eosAPI = {};
    // var url_admin = 'http://eosservicetest2:8000/proc/admin/';
    // var url_user = 'http://eosservicetest2:8000/proc/user/';
    var url_admin = 'http://p05614910a92540.cern.ch:8000/proc/admin/';
    var url_user = 'http://p05614910a92540.cern.ch:8000/proc/user/';
    //var url_admin = 'http://eos-dev01.cern.ch:8000/proc/admin/';
    //var url_user = 'http://eos-dev01.cern.ch:8000/proc/user/';
    eosAPI.getGroups = function() {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
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
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
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
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
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
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
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
        url: url_user,
        params: {
          'mgm.cmd': 'version',
          'mgm.option': 'fm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getClientInfo = function() {
      return $http({
        method: 'JSONP',
        url: url_user,
        params: {
          'mgm.cmd': 'who',
          'mgm.option': 'sm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.getNsStat = function() {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
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
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'status',
          'mgm.space': 'default',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.setSpaceQuota = function(spacename, entity) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'quota',
          'mgm.space': spacename,
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK',
          'mgm.space.quota': entity
        }
      });
    };

    eosAPI.setSpaceConfig = function(spacename, key, value) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'config',
          'mgm.space.name': spacename,
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'm',
          'callback':'JSON_CALLBACK',
          'mgm.space.key': key,
          'mgm.space.value': value
        }
      });
    };

    eosAPI.getClusterInfo = function(infoType, spacename) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'node-get',
          'mgm.space': spacename,
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.format': 'fuse',
          'callback':'JSON_CALLBACK',
          'mgm.space.node-get.key': 'kinetic.' + infoType + '.default'
        }
      });
    };

    eosAPI.updateCluster = function(infoType, spacename, base64_encoded_json) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'kinetic-json-store',
          'mgm.space': spacename,
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK',
          'mgm.space.kinetic-json-store.key': infoType,
          'mgm.space.kinetic-json-store.val': 'base64:' + base64_encoded_json
        }
      });
    };

    eosAPI.publishCluster = function(infoType, spacename) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'node-set',
          'mgm.space': spacename,
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK',
          'mgm.space.node-set.key': 'kinetic.' + infoType + '.default',
          'mgm.space.node-set.val': 'file:\/var\/eos\/kinetic\/kinetic-' + infoType + '-default.json'
        }
      });
    };

    eosAPI.triggerReload = function(spacename) {
      return $http({
        method: 'JSONP',
        url: url_admin,
	headers: {
           'remote-user': 'root'
        },
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'node-set',
          'mgm.space': spacename,
          'eos.ruid': '0',
          'eos.rgid': '0',
          'callback':'JSON_CALLBACK',
          'mgm.space.node-set.key': 'kinetic.reload',
          'mgm.space.node-set.val': 'default'
        }
      });
    };

    eosAPI.updateConfig = function(spacename) {
      eosAPI.publishCluster('cluster', spacename);
      eosAPI.publishCluster('location', spacename);
      eosAPI.publishCluster('security', spacename);
      eosAPI.triggerReload(spacename);
    };

    return eosAPI;
}

angular
  .module('urbanApp')
  .factory('eosService', ['$http', eosServiceAPI]);
