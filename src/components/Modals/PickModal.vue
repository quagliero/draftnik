<template>
  <modal @close="$emit('close')">
    <h3 class="title">Pick ({{ pickAndRound }})</h3>
    <p>Currently owned by: {{ team.name }}</p>
    <p>draftpicktradecalculator.com value: <strong>{{ bayesianValue }}</strong></p>
    <progress class="progress" :value="percentageValue" max="100">{{percentageValue}}</progress>
    <p>Players in this range: {{ playersInRange }}</p>
    <p>
      <button
        v-if="newTrade"
        class="button is-primary"
        @click="handleTradePickClick"
      >
        Trade for this pick
      </button>
      <button
        v-if="existingTrade && !(newTrade) && !(pickAlreadyIncluded)"
        @click="handleAddPickClick"
        class="button is-primary"
      >
        Add to trade
      </button>
      <button
        v-if="existingTrade && pickAlreadyIncluded"
        class="button is-warning"
        @click="handleRemovePickClick"
      >
        Remove this pick
      </button>
    </p>
  </modal>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import { getTeamById, getPickValue, getPlayersInRange } from '../../utils';
  import { SELECT_RECEIVING_TEAM } from '../../store/mutations';
  import Modal from '../Modal.vue';

  export default {
    name: 'pick-modal',
    props: [],
    components: {
      Modal,
    },
    computed: {
      ...mapGetters([
        'selectedPick',
        'bayesianMaxValue',
        'currentTrade',
      ]),
      existingTrade() {
        return this.currentTrade.id !== undefined;
      },
      newTrade() {
        const notAllowed = [this.currentTrade.receivingTeam, this.currentTrade.givingTeam];
        // there is no existing trade and the pick doesn't belong to us or them
        return !(this.existingTrade) || notAllowed.indexOf(this.selectedPick.team) === -1;
      },
      pickAlreadyIncluded() {
        return this.currentTrade.receivingPicks.find(
          pick => pick.overall === this.selectedPick.overall);
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
        return (this.bayesianValue / this.bayesianMaxValue) * 100;
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
      ]),
      ...mapMutations({
        SELECT_RECEIVING_TEAM,
      }),
      handleTradePickClick() {
        // business logic to ween out illegal picks
        this.createNewTrade({
          givingTeam: 2,
          receivingTeam: this.team.id,
          pick: this.selectedPick,
        });
        this.SELECT_RECEIVING_TEAM(this.team.id);
        this.$emit('close');
      },
      handleAddPickClick() {
        // business logic to ween out illegal picks
        this.addPickToTrade({
          id: this.currentTrade.id,
          givingTeam: 2,
          receivingTeam: this.team.id,
          pick: this.selectedPick,
        });
        this.$emit('close');
      },
      handleRemovePickClick() {
        // business logic to ween out illegal picks
        this.removePickFromTrade({
          id: this.currentTrade.id,
          givingTeam: 2,
          receivingTeam: this.team.id,
          pick: this.selectedPick,
        });
        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss">

</style>
