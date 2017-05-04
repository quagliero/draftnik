<template>
  <modal
    :close="() => this.$bus.$emit('pickModal.close')"
    v-if="showPickModal === true"
  >
    <h3 class="title">Pick ({{ pickAndRound }})</h3>
    <p>Currently owned by: {{ team.displayName }}</p>
    <p>draftpicktradecalculator.com value: <strong>{{ bayesianValue }}</strong></p>
    <progress class="progress" max="100" :value="percentageValue"/>
    <div v-if="authenticated === true">
      <p>
        <button class="add-to-watchlist button is-small is-white"
          v-for="player in playersInRange"
          :key="player.id"
          @click="handleAddToWatchlist(player)"
        >
          <span class="icon is-small">
            <i v-if="isInWatchlist(player.id)" class="fa fa-check"></i>
            <i v-else class="fa fa-plus"></i>
          </span>
          <span>{{ player.name }}</span>
        </button>
      </p>
      <p>
        <button
          v-if="newTrade"
          class="button is-primary"
          @click="handleTradePickClick"
        >
          Trade {{(this.isOwnPick) ? '' : 'for'}} this pick
        </button>
        <button
          v-if="existingTrade && !(newTrade) && !(pickAlreadyIncluded)"
          @click="handleAddPickClick"
          class="button is-success"
          :class="{ 'is-warning' : isOwnPick }"
        >
          Add to trade
        </button>
        <button
          v-if="existingTrade && pickAlreadyIncluded"
          class="button is-danger"
          @click="handleRemovePickClick"
        >
          Remove this pick
        </button>
      </p>
    </div>
    <div v-else>
      <p>
        <router-link :to="{ name: 'login' }" @click.native="$emit('close')">Login</router-link>
        to trade picks and add players to your watchlist.
      </p>
    </div>
  </modal>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import {
    getTeamById,
    getPickValue,
    getPlayersInRange,
  } from '../../utils';
  import { SELECT_RECEIVING_TEAM } from '../../store/mutations';
  import Modal from '../Modal.vue';

  export default {
    name: 'pick-modal',
    props: [],
    data() {
      return {
        showPickModal: false,
      };
    },
    components: {
      Modal,
    },
    computed: {
      ...mapGetters([
        'authenticated',
        'currentDraft',
        'selectedPick',
        'currentUser',
        'bayesianMaxValue',
        'currentTrade',
        'watchlist',
      ]),
      existingTrade() {
        return this.currentTrade.id !== undefined;
      },
      newTrade() {
        const notAllowed = [
          this.currentTrade.receivingTeam,
          this.currentTrade.givingTeam,
        ];

        // there is no existing trade and the pick doesn't belong to us or them
        return !(this.existingTrade) || notAllowed.indexOf(this.selectedPick.team) === -1;
      },
      pickAlreadyIncluded() {
        const isReceiving = this.currentTrade.receivingPicks.find(
          pick => pick.overall === this.selectedPick.overall);

        if (isReceiving) {
          return true;
        }

        return this.currentTrade.givingPicks.find(
          pick => pick.overall === this.selectedPick.overall);
      },
      isOwnPick() {
        return this.selectedPick.team === this.currentUser.id;
      },
      team() {
        return getTeamById(this.selectedPick.team);
      },
      pickAndRound() {
        return `${this.selectedPick.round}.${this.selectedPick.pickInRound}`;
      },
      bayesianValue() {
        return getPickValue(this.selectedPick.overall);
      },
      percentageValue() {
        return Math.round((this.bayesianValue / this.bayesianMaxValue) * 100);
      },
      playersInRange() {
        return getPlayersInRange(this.selectedPick.overall);
      },
    },
    methods: {
      ...mapActions([
        'createNewTrade',
        'addPickToTrade',
        'removePickFromTrade',
        'addToWatchlist',
      ]),
      ...mapMutations({
        SELECT_RECEIVING_TEAM,
      }),
      isInWatchlist(playerId) {
        return this.watchlist && this.watchlist[playerId];
      },
      handleAddToWatchlist(player) {
        this.addToWatchlist({
          player,
          draft: this.currentDraft.id,
          user: this.currentUser.id,
        });
      },
      handleTradePickClick() {
        const receivingTeam = (this.team.id === this.currentUser.id) ? null : this.team.id;
        this.createNewTrade({
          givingTeam: this.currentUser.id,
          receivingTeam,
          pick: this.selectedPick,
          // keep our picks stored in case we just want to trial out
          // different trade partners with the same set of our picks
          givingPicks: this.currentTrade.givingPicks,
        });
        // can't be your own partner
        if (this.isOwnPick === false) {
          this.SELECT_RECEIVING_TEAM(this.team.id);
        }
        this.$bus.$emit('pickModal.close');
      },
      handleAddPickClick() {
        const receivingTeam = (this.team.id === this.currentUser.id) ? null : this.team.id;
        // business logic to ween out illegal picks
        this.addPickToTrade({
          id: this.currentTrade.id,
          givingTeam: this.currentUser.id,
          receivingTeam,
          pick: this.selectedPick,
        });
        this.$bus.$emit('pickModal.close');
      },
      handleRemovePickClick() {
        // business logic to ween out illegal picks
        this.removePickFromTrade({
          id: this.currentTrade.id,
          givingTeam: this.currentUser.id,
          receivingTeam: this.team.id,
          pick: this.selectedPick,
        });
        this.$bus.$emit('pickModal.close');
      },
    },
    mounted() {
      this.$bus.$on('pickModal.open', () => {
        this.showPickModal = true;
      });

      this.$bus.$on('pickModal.close', () => {
        this.showPickModal = false;
      });

      this.$store.dispatch('getDrafts').then(() => {
        this.$store.dispatch('getWatchlist', {
          draft: this.currentDraft.id,
          user: this.currentUser.id,
        });
      });
    },
  };
</script>

<style lang="scss">
  @import "~bulma/utilities/_all";
  @import "~bulma/components/modal";
  @import "~bulma/elements/progress";

  .add-to-watchlist {
    .icon {
      color: $green;
    }
  }
</style>
