<template>
  <article class="panel">
    <trade-title
      :trade="trade"
    />
    <trade-details
      :trade="trade"
      tense="past"
    />
    <trade-outcome
      status="is-success"
      notification="Trade accepted"
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
    name: 'trade-accepted',
    props: ['trade'],
    components: {
      TradeTitle,
      TradeDetails,
      TradeOutcome,
      TradeCalculators,
    },
  };
</script>
