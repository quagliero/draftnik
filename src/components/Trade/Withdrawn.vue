<template>
  <article class="panel">
    <trade-title
      :trade="trade"
    />
    <trade-details
      :trade="trade"
    />
    <trade-outcome
      status="is-danger"
      notification="Trade withdrawn"
      :date="trade.closedAt"
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
  import TradeOutcome from './Outcome.vue';
  import TradeCalculators from './Calculators.vue';

  export default {
    name: 'trade-withdrawn',
    props: ['trade'],
    components: {
      TradeTitle,
      TradeDetails,
      TradeOutcome,
      TradeCalculators,
    },
  };
</script>
