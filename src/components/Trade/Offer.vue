<template>
  <article class="panel">
    <trade-title
      :trade="trade"
    />
    <trade-details
      :trade="trade"
    />
    <trade-actions
      :trade="trade"
    />
    <hr/>
    <trade-calculators
      :trade="trade"
    />
  </article>
</template>

<script>
  import TradeTitle from './Title.vue';
  import TradeDetails from './Details.vue';
  import TradeActions from './Actions.vue';
  import TradeCalculators from './Calculators.vue';

  export default {
    name: 'trade-offer',
    props: ['trade'],
    components: {
      TradeTitle,
      TradeDetails,
      TradeActions,
      TradeCalculators,
    },
  };
</script>
