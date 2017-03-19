<template>
  <nav class="panel">
    <p class="panel-heading">
      My picks
    </p>
    <!-- <div class="panel-block">
      <p class="control has-icon">
        <input class="input is-small" type="text" placeholder="Search">
        <span class="icon is-small">
          <i class="fa fa-search"></i>
        </span>
      </p>
    </div> -->
    <p class="panel-tabs">
      <a
        v-for="num in pickFilters"
        @click="filterPickBy(num)"
        :class="{ 'is-active' : selectedPickFilter === num }"
      >
        {{ num === 0 ? 'All' : `Top ${num}` }}
      </a>
    </p>
    <a
      v-for="pick in picks"
      v-if="filteredPicks === null"
      class="panel-block"
    >
      <span class="panel-icon">
        <i class="fa fa-book"></i>
      </span>
      #{{ pick.overall }} - {{ pick.round }}.{{ pick.pickInRound }}
    </a>
    <a
      v-for="pick in filteredPicks"
      v-if="filteredPicks !== null"
      class="panel-block"
    >
      <span class="panel-icon">
        <i class="fa fa-chevron-circle-right"></i>
      </span>
      #{{ pick.overall }} - {{ pick.round }}.{{ pick.pickInRound }}
    </a>
    <!-- <div class="panel-block">
      <button class="button is-primary is-outlined is-fullwidth">
        Reset all filters
      </button>
    </div> -->
  </nav>
</template>

<script>
  import filter from 'lodash/filter';

  export default {
    name: 'my-picks',
    props: ['picks'],
    data() {
      return {
        filteredPicks: null,
        pickFilters: [0, 12, 24, 36, 50, 75],
        selectedPickFilter: 0,
      };
    },
    methods: {
      filterPickBy(num) {
        this.selectedPickFilter = num;

        if (num === 0) {
          this.filteredPicks = this.picks;
          return;
        }

        this.filteredPicks = filter(this.picks, (p) => p.overall <= num);
      },
    },
  };
</script>
