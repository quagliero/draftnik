<template>
  <div class="section">
    <section class="container">
      <h1 class="title">Command Centre</h1>
      <section class="section">
        <div class="columns">
          <div class="column is-8 is-offset-2">
            <div class="panel">
              <p class="panel-heading">
                Pick Order
              </p>
              <div class="panel-block">
                <form
                  class="pick-order-form"
                  @submit.prevent="handleSubmit"
                >
                  <div
                    v-for="(slot, team) in draftOrder"
                    v-if="team"
                    class="field is-horizontal"
                  >
                    <div class="field-label">
                      <label class="label">{{ getUserById(team).displayName }}</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <div class="select is-fullwidth">
                          <select
                            @change="handleChange(team, $event.target.value)"
                          >
                            <option value=""></option>
                            <option
                              v-for="pick in picks"
                              :value="pick"
                              :selected="slot === pick"
                            >
                              Pick {{ pick }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="isError" class="control">
                    <p class="notification is-danger">
                      <b>Picks are not evenly distributed</b>
                    </p>
                  </div>
                  <div class="control">
                    <button
                      type="submit"
                      class="is-pulled-right button is-medium is-primary"
                      disabled
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import toArray from 'lodash/toArray';
  import sortBy from 'lodash/sortBy';
  import keys from 'lodash/keys';
  import { db } from '../database';

  export default {
    name: 'admin-view',
    data() {
      return {
        isError: false,
        picks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      };
    },
    computed: {
      ...mapGetters([
        'currentUser',
        'currentDraft',
        'getUserById',
      ]),
      draftOrder() {
        return Object.assign({}, this.currentDraft.order);
      },
    },
    methods: {
      handleFocus(team) {
        this.pickCurrentTeam = team;
      },
      handleChange(team, pick) {
        this.draftOrder[team] = Number(pick);
      },
      handleSubmit() {
        function hasDuplicates(array) {
          const valuesSoFar = [];
          for (let i = 0; i < array.length; i += 1) {
            const value = array[i];
            if (valuesSoFar.indexOf(value) !== -1) {
              return true;
            }
            valuesSoFar.push(value);
          }
          return false;
        }

        if (hasDuplicates(toArray(this.draftOrder)) === true) {
          this.isError = true;
          return false;
        }

        // clear DB first
        const urlBase = `/drafts/${this.currentDraft.id}/picks`;
        db.ref(urlBase).set(null);

        // store order
        db.ref(`/drafts/${this.currentDraft.id}/order`).set(this.draftOrder);

        // loop through rounds and map and save each pick
        const orderedTeams = sortBy(keys(this.draftOrder), (team) => this.draftOrder[team]);
        const snakeTeams = orderedTeams.slice(0).reverse();

        const rounds = 15;
        let overall = 0;

        for (let r = 1; r <= rounds; r += 1) {
          const evenRound = r % 2 === 0;
          const teamsArray = (evenRound === true) ? snakeTeams : orderedTeams;
          // eslint-disable-next-line
          teamsArray.forEach((team, p) => {
            overall += 1;
            const pickKey = db.ref(urlBase).push().key;
            db.ref(`${urlBase}/${pickKey}`).set({
              id: pickKey,
              overall,
              round: r,
              pickInRound: p + 1,
              team,
            });
          });
        }

        return true;
      },
    },
  };
</script>

<style>
  .pick-order-form {
    width: 100%;
  }
</style>
