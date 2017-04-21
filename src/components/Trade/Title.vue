<template>
  <h3 class="title is-3">
    <span class="icon is-medium">
      <i :class="['fa', userProposed ? 'fa-arrow-right' : 'fa-arrow-left']"></i>
    </span>
    Trade offer {{ userProposed ? 'to' : 'from' }} {{ otherTeam.displayName }}
  </h3>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'trade-title',
    props: ['trade'],
    computed: {
      ...mapGetters([
        'currentUser',
        'getUserById',
      ]),
      otherTeam() {
        return (this.userProposed) ? this.receivingTeam : this.givingTeam;
      },
      givingTeam() {
        return this.getUserById(this.trade.givingTeam);
      },
      receivingTeam() {
        return this.getUserById(this.trade.receivingTeam);
      },
      userProposed() {
        return (this.trade.givingTeam === this.currentUser.id);
      },
    },
  };
</script>
