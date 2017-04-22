<template>
  <article class="panel">
    <trade-title
      :trade="trade"
    />
    <br/>
    <trade-details
      :trade="trade"
      tense="past"
    />
    <trade-outcome
      status="is-success"
      notification="This trade was accepted"
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
