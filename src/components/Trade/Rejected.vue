<template>
  <article class="panel">
    <trade-title
      :trade="trade"
    />
    <br/>
    <trade-details
      :trade="trade"
    />
    <trade-outcome
      status="is-danger"
      notification="This offer was rejected"
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
    name: 'trade-rejected',
    props: ['trade'],
    components: {
      TradeTitle,
      TradeDetails,
      TradeOutcome,
      TradeCalculators,
    },
  };
</script>
