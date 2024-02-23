local
  m = import 'baedeker-library/mixin/spec.libsonnet'
;

function(relay_spec)

  local relay = {
    name: 'relay',
    bin: 'bin/polkadot',
    validatorIdAssignment: 'staking',
    spec: { Genesis: {
      chain: relay_spec,
      modify:: m.genericRelay($),
    } },
    nodes: {
      [name]: {
        bin: $.bin,
        wantedKeys: 'relay',
      }
      for name in ['alice', 'bob', 'charlie', 'dave', 'eve', 'ferdie']
    },
  };

  local quartz = {
    name: 'quartz',
    bin: 'bin/quartz',
    paraId: 1001,
    spec: { Genesis: {
      modify:: m.genericPara($),
    } },
    nodes: {
      [name]: {
        bin: $.bin,
        wantedKeys: 'para',

        extraArgs: [
          '-lxcm=trace',
        ],
      }
      for name in ['alice', 'bob']
    },
  };

  relay {
    parachains: {
      [para.name]: para
      for para in [quartz]
    },
  }
