<template>
  <nav class="panel">
    <p class="panel-heading">Picks</p>
    <!-- <div class="panel-block">
      <p class="control has-icon">
        <input class="input is-small" type="text" placeholder="Search">
        <span class="icon is-small">
          <i class="fa fa-search"></i>
        </span>
      </p>
    </div> -->
    <div class="panel-tabs">
      <a
        v-for="num in pickFilters"
        @click="filterPickBy(num)"
        :class="{ 'is-active' : selectedPickFilter === num }"
      >
        {{ num === 0 ? 'All' : `Top ${num}` }}
      </a>
    </div>
    <div
      v-for="pick in filteredPicks"
      v-if="filteredPicks.length"
      class="panel-block"
    >
      <button
        class="button is-white"
        @click="onPickClick(pick)"
      >
        <span class="panel-icon">
          <i class="fa fa-vcard"></i>
        </span>
        #{{ pick.overall }} - {{ pick.round }}.{{ pick.pickInRound }}
      </button>
    </div>
    <!-- <a
      v-for="pick in filteredPicks"
      v-if="filteredPicks !== null"
      class="panel-block"
    >
      <span class="panel-icon">
        <i class="fa fa-chevron-right"></i>
      </span>
      #{{ pick.overall }} - {{ pick.round }}.{{ pick.pickInRound }}
    </a> -->
    <!-- <div class="panel-block">
      <button class="button is-primary is-outlined is-fullwidth">
        Reset all filters
      </button>
    </div> -->
  </nav>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex';
  import filter from 'lodash/filter';
  import { SELECT_PICK } from '../../store/mutations';

  export default {
    name: 'my-picks',
    data() {
      return {
        // filteredPicks: this.computedFilteredPicks,
        pickFilters: [0, 12, 24, 36, 50, 75],
        selectedPickFilter: 0,
      };
    },
    computed: {
      filteredPicks() {
        return this.filterPickBy(this.selectedPickFilter);
      },
      ...mapGetters([
        'currentUser',
        'currentDraft',
        'picksByTeam',
      ]),
      picks() {
        return this.picksByTeam(this.currentUser.id);
      },
    },
    methods: {
      ...mapMutations([
        SELECT_PICK,
      ]),
      filterPickBy(num) {
        this.selectedPickFilter = num;
        if (num === 0) {
          return this.picks;
        }

        return filter(this.picks, (p) => p.overall <= num);
      },
      onPickClick(pick) {
        this.SELECT_PICK({ pick });
        this.$bus.$emit('pickModal.open');
      },
    },
  };
</script>
