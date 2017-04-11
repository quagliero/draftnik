<template>
  <nav class="panel">
    <p class="panel-heading">Picks</p>
    <div class="panel-tabs">
      <a
        v-for="num in pickFilters"
        @click="filterPickBy(num)"
        :class="{ 'is-active' : selectedPickFilter === num }"
      >
        {{ num === 0 ? 'All' : `${num}` }}
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
        pickFilters: [0, 12, 24, 36, 50, 75, 100],
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
