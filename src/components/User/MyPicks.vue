<template>
  <nav class="panel">
    <p class="panel-heading">
      Picks
      <button
        class="button is-small pull-right"
        @click="toggleExpanded()"
      >
        <span class="icon">
          <i
            :class="['fa', {
              'fa-arrow-circle-up': expanded === true,
              'fa-arrow-circle-down': expanded === false,
            }]">
          </i>
        </span>
      </button>
    </p>
    <template v-if="currentDraft.picks && expanded">
      <div class="panel-tabs">
        <a
          v-for="num in pickFilters"
          @click.prevent="selectedPickFilter = num"
          :class="{ 'is-active' : selectedPickFilter === num }"
        >
          {{ num === 0 ? 'All' : `${num}` }}
        </a>
      </div>
      <div
        v-for="pick in filteredPicks"
        v-if="filteredPicks.length > 0"
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
      <div
        v-show="filteredPicks.length === 0"
        class="panel-block"
      >
        <em>{{ displayEmptyFilterMessage(selectedPickFilter) }}</em>
      </div>
    </template>
    <template v-if="currentDraft.picks && !expanded">
      <div class="panel-tabs">
        <a @click.prevent="toggleExpanded()">
          <i class="fa fa-angle-double-down"></i>
          Show
          <i class="fa fa-angle-double-down"></i>
        </a>
      </div>
    </template>
    <template v-if="!currentDraft.picks && expanded">
      <div class="panel-block">
        <span>Fetching picks </span>
        <span class="icon">
          <i class="fa fa-spinner fa-spin"></i>
        </span>
      </div>
    </template>
  </nav>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex';
  import filter from 'lodash/filter';
  import { SELECT_PICK, CHANGE_USER_PREF } from '../../store/mutations';

  export default {
    name: 'my-picks',
    data() {
      return {
        pickFilters: [0, 12, 24, 36, 50, 75, 100],
        selectedPickFilter: 0,
      };
    },
    computed: {
      ...mapGetters([
        'currentUser',
        'currentDraft',
        'picksByTeam',
        'userPrefs',
      ]),
      expanded() {
        return this.userPrefs.showPicks;
      },
      filteredPicks() {
        return this.filterPickBy(this.selectedPickFilter);
      },
      picks() {
        return this.picksByTeam(this.currentUser.id);
      },
    },
    methods: {
      ...mapMutations([
        SELECT_PICK,
        CHANGE_USER_PREF,
      ]),
      toggleExpanded() {
        this.CHANGE_USER_PREF({
          pref: 'showPicks',
          value: !this.expanded,
        });
      },
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
      displayEmptyFilterMessage(filterNumber) {
        return `You have no picks in the top ${filterNumber}`;
      },
    },
  };
</script>
