<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">Set a new value</h1>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Current value</h5>

            <p class="card-text">
              <strong>Value:</strong> {{ getNum }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">

            <h5 class="card-title">Set new value</h5>

            <form @submit.prevent="onSubmit">
              <div class="mb-3">
                <label for="valField" class="form-label">Enter new value</label>
                <input id="valField" v-model="newValue" type="text" class="form-control" :placeholder="Number(getNum) + 1">
              </div>

              <button type="submit" class="btn btn-outline-primary">Submit</button>
            </form>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Web3 from "web3";

export default {
  name: "Main",
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getWeb3"]),
    ...mapGetters("contracts", ["getNum", "getCalcAbi", "getCalcAddress", "getCalcContract"])
  },
  getActiveAccount(state) {
    if (!state.activeAccount) {
      return window.ethereum.selectedAddress;
    }

    return state.activeAccount;
  },

  created() {
    this.$store.dispatch("contracts/fetchCalcContract");
    this.$store.dispatch("contracts/fetchNum");
    this.$store.dispatch("contracts/storeCalcAbi");
    this.$store.dispatch("contracts/storeCalcAddress");

    // if web3 provider has not been yet loaded, redirect to root
    console.log(this.web3)
    if (!this.getActiveAccount()) {
      document.location.href="/";
    } else {
      // let component = this;

    //   // historical
    //   console.log(this.getActiveAccount)
    //   this.getCalcContract.getPastEvents('Changed', {
    //     topics:["0xa6697e974e6a320f454390be03f74955e8978f1a6971ea6730542e37b66179bc"],
    //     fromBlock: 0,
    //     toBlock: 'latest'
    //   }, function(error, events){ console.log(events); })
    //       .then(function(events){
    //         console.log(events) // same results as the optional callback above
    //       });
    //
    //   // set event listener
    //   console.log(this.getCalcContract.events)
    //   this.getCalcContract.events.allEvents({
    //     filter: {_from: this.getActiveAccount}, // only events from this user
    //   })
    //   .on("connected", function(subscriptionId) {
    //     // when the event listener is set
    //     console.log("NumberSet event subscription ID: " + subscriptionId);
    //   })
    //   .on('data', function(event){
    //     // when an event is triggered
    //     //console.log(event);
    //
    //     component.$toasted.show('The new number has been set to ' + event.returnValues.value, {
    //       type: 'success',
    //       duration: 5000,
    //       theme: "bubble",
    //       position: "top-center"
    //     });
    //
    //     // refresh the num value
    //     component.$store.dispatch("contracts/fetchNum");
    //   })
    //   .on('error', function(error, receipt) {
    //     // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
    //     window.console.log(error);
    //     window.console.log(receipt);
    //   });
    }
  },
  data() {
    return {
      newValue: null,
      contract: null
    }
  },
  methods: {
    async onSubmit() {
      console.log(this.getCalcContract)
      await this.getCalcContract.methods.setNum(Web3.utils.utf8ToHex(this.newValue)).send({
        from: this.getActiveAccount
      });
    }
  }
}
</script>
