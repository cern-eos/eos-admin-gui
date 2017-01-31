'use strict';

function eosServiceAPI($http) {

  var eosAPI = {};
    //var url_admin = 'http://p05614910a92540.cern.ch:8000/proc/admin/';
    //var url_user = 'http://p05614910a92540.cern.ch:8000/proc/user/';
    var url_admin = 'https://p05614910a92540.cern.ch/proc/admin/';
    var url_user = 'https://p05614910a92540.cern.ch/proc/user/';
    
    eosAPI.whoami = function() {
      return $http({
        method: 'JSONP',
        url: url_user,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'whoami',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.format': 'm',
          'mgm.option': 'am',
          'callback':'JSON_CALLBACK'
        },
	timeout: 1000,
      });
    };

    
    eosAPI.getGroups = function() {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
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
    
    eosAPI.setGroup = function(name, state) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'group',
          'mgm.subcmd': 'set',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'json',
          'mgm.group': name,
          'mgm.group.state': state,
          'callback':'JSON_CALLBACK'
        }
      });
    };
    eosAPI.removeGroup = function(name) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'group',
          'mgm.subcmd': 'rm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'json',
          'mgm.group': name,
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
        withCredentials: true,
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

    eosAPI.addFileSystem = function(fsid, uuid, node, mountpoint, space, status) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'fs',
          'mgm.subcmd': 'add',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.fs.uuid': uuid,
	  'mgm.fs.fsid': fsid,
	  'mgm.fs.node': node,
	  'mgm.fs.mountpoint' : mountpoint,
	  'mgm.fs.space' : space,
	  'mgm.fs.configstatus': status,
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.moveFileSystem = function(fsid, space) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'fs',
          'mgm.subcmd': 'mv',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.space': space,
          'mgm.fs.id': fsid,
          'callback':'JSON_CALLBACK'
        }
      });
    };

   
    eosAPI.configFileSystem = function(fsid, key,value) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'fs',
          'mgm.subcmd': 'config',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.fs.identifier': fsid,
          'mgm.fs.key' : key,
          'mgm.fs.value': value,
          'callback':'JSON_CALLBACK'
        }
      });
    };



    eosAPI.removeFileSystem =  function(fs) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'fs',
          'mgm.subcmd': 'rm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'json',
          'mgm.fs.id': fs,
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
        withCredentials: true,
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

     eosAPI.removeNode =  function(node) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'node',
          'mgm.subcmd': 'rm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'json',
          'mgm.node': node,
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
        withCredentials: true,
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

    eosAPI.defineSpace = function(name,groupmod,groupsize) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'define',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'json',
          'mgm.space': name,
          'mgm.space.groupmod' : groupmod,
	  'mgm.space.groupsize' : groupsize,
          'callback':'JSON_CALLBACK'
        }
      });
    };

    eosAPI.removeSpace = function(name) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'rm',
          'eos.ruid': '0',
          'eos.rgid': '0',
          'mgm.outformat': 'json',
          'mgm.space': name,
          'callback':'JSON_CALLBACK'
        }
      });
    };


    eosAPI.getVersion = function() {
      return $http({
        method: 'JSONP',
        url: url_user,
        withCredentials: true,
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
        withCredentials: true,
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
        withCredentials: true,
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

    eosAPI.getSpaceStatus = function(space) {
      return $http({
        method: 'JSONP',
        url: url_admin,
        headers: {
           'remote-user': 'root'
        },
        withCredentials: true,
        params: {
          'mgm.cmd': 'space',
          'mgm.subcmd': 'status',
          'mgm.space': space,
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
        withCredentials: true,
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
        withCredentials: true,
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
        withCredentials: true,
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
        withCredentials: true,
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
        withCredentials: true,
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
        withCredentials: true,
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
