<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2"><img src="logo.png" height="70px" />  Welcome to the GlobalRegistrar ERC721 Wrapper!</h1>
    </div>

    <p>Step 1: Retrieve Status. <br/> Step 2: If unwrapped, press wrap!<br/>Step 3: Profit $$!</p>

    <p>First, run Get Status.  If it's available, you can hit "Reserve N Wrap", wow you just claimed AND wrapped, NICE!</p>
    <p>If it's not available, that sucks</p>
    <p>Lastly, if it's yours, but unwrapped, sadly you must do the three "Wrap" steps.  Still pretty easy though huh?</p>
    <p>
      <strong>View the Wrapped Collection: </strong> <a href="https://opensea.io/collection/global-registrars">Global Registrars</a>
    </p>

    <div class="col-md-6">
      <div class="card">
        <div class="card-body">

          <h5 class="card-title">Get GlobalRegistrar Status</h5>
          <p class="card-text">Enter the GlobalRegistrar ID you want to check.</p>
          <p>Please select the version of the contract, 9 or 0 are probably what you're looking for.</p>
          <p>As a side note, Gavin Wood is the author of GlobalRegistrar, 9 would become the "official" version, built into the Geth client.</p>
          <select v-model="selected">
            <option v-bind:key="item.contract" v-for="item in contracts" :value=item.contract>{{ item.name }}</option>
          </select><br/>
          <span>Selected: {{ selected }}</span>
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
<!--              <label for="valField" class="form-label">Enter new value</label>-->
              <label for="valField" class="form-label"><b>Current Status:</b> {{ status }}</label>
              <p>Try typing the name you're interested in here, then hit "Get Status"</p>
              <input id="valField" v-model="newValue" type="text" class="form-control" :placeholder="getNum">
            </div>

            <button type="submit" class="btn btn-outline-primary">Get Status</button>{{ }}
            <button type="button" @click="reserveNWrap()" class="btn btn-outline-primary" :class="(status === 'Not registered!') ? '' : 'hidden'" >Reserve N Wrap</button> {{ }}
            <button type="button" @click="unwrap()" class="btn btn-outline-danger" :class="(status === 'Wrapped by you! Congrats!') ? '' : 'hidden'" >Unwrap to Original Contract</button> {{ }}
            <br/><br/>

            <button type="button" @click="wrapExisting()" class="btn btn-outline-primary" :class="(status === 'You own but unwrapped!') ? '' : 'hidden'" >Wrap Existing Step 1 (Begin Wrap)</button>
            <br/><br/>
            <button type="button" @click="sendToWrapper()" class="btn btn-outline-primary" :class="(status === 'Wrap in progress! Do step 2 now!') ? '' : 'hidden'" >Wrap Existing Step 2 (Send to Wrapper)</button>
            <br/><br/>
            <button type="button" @click="finishWrap()" class="btn btn-outline-primary" :class="(status === 'Time for the final wrap!') ? '' : 'hidden'" >Wrap Existing Step 3 (Finish Wrap)</button>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Web3 from "web3";
import Original from "../contracts/Original.json";

export default {
  name: "Home",
  computed: {
    ...mapGetters("accounts", ["getActiveAccount", "getWeb3","getChainName", "isUserConnected"]),
    ...mapGetters("contracts", ["getNum", "getCalcAbi", "getCalcAddress", "getCalcContract"])
  },
  data() {
    return {
      newValue: null,
      status: 'Unknown',
      selected: '',
      contract: null,
      contracts: [
        {contract: '0x5564886ca2C518d1964E5FCea4f423b41Db9F561', name: '0 - (linagee) - Aug-08-2015 05:20:23 AM +UTC', index: 0},
        {contract: '0x2272D8d4dEc7DF90a36f03EFF778DECc6918F1A9', name: '1 - Aug-10-2015 10:31:45 AM +UTC', index: 1},
        {contract: '0xAefd94F2b04B219ae2156B3a00A5E415Bff061C0', name: '2 - Aug-19-2015 07:42:24 AM +UTC', index: 2},
        {contract: '0x32FBA3C059bB9DC91227F102E708cC0255fEB8Ee', name: '3 - Aug-25-2015 03:33:33 AM +UTC', index: 3},
        {contract: '0xeFeF5a487410f7ba8B034cDB5a08cc1e3Ba89B3c', name: '4 - Aug-25-2015 03:30:03 PM +UTC', index: 4},
        {contract: '0x2AB516c9a76461F6cbE18F6A6836d05D9E02cEfF', name: '5 - Aug-28-2015 02:47:53 PM +UTC', index: 5},
        {contract: '0x822964bF8402477833837c86Ccff926c169bA550', name: '6 - Aug-30-2015 09:09:43 AM +UTC', index: 6},
        {contract: '0xf4E1Aa70A22148A317D551194cbC7c92D586298F', name: '7 - Sep-06-2015 06:17:33 PM +UTC', index: 7},
        {contract: '0x3A354AC32d303Bb0562842cfe2f5Fb07D9ca845A', name: '8 - Sep-15-2015 08:07:57 PM +UTC', index: 8},
        {contract: '0x33990122638b9132cA29c723BDF037F1a891a70C', name: '9 - (Official) - Sep-24-2015 11:06:02 AM +UTC', index: 9},
        {contract: '0x92c7143b1A11Dc199Cb0C58311f7c37395546615', name: '10 - Sep-24-2015 10:10:00 PM +UTC', index: 10},
        {contract: '0xE121c78bD4DC097Bd949ba94e2a4621c32700630', name: '11 - Sep-24-2015 10:10:06 PM +UTC', index: 11},
        {contract: '0x2B794737af0F32C30696d48563866E5e3bf7008a', name: '12 - Sep-24-2015 10:10:51 PM +UTC', index: 12},
        {contract: '0xb829C107E7BeEdF9D97694860E99eFa66fD2eD3a', name: '13 - Sep-24-2015 10:56:05 PM +UTC', index: 13},
        {contract: '0xA5715A1cB7572EeaEEC2855d4B85A8aFeC84dc28', name: '14 - Oct-01-2015 08:27:04 PM +UTC', index: 14},
        {contract: '0x205162f8A65F9DC1B9778127Bf6182da40f44276', name: '15 - Oct-07-2015 01:05:05 PM +UTC', index: 15},
        {contract: '0x6B22586AB58D39e1D700cAd989f9b2aAE1fD863F', name: '16 - Oct-18-2015 04:26:46 AM +UTC', index: 16},
        {contract: '0xB278F342B2cc98de7762F579A0b41DC522bf8092', name: '17 - Jan-09-2016 04:01:18 AM +UTC', index: 17},
        {contract: '0x07408Af8Ca23Cdd4Fc7C09d47AA91bbe5A308525', name: '18 - Feb-06-2016 07:29:47 PM +UTC}', index: 18}
      ]
    }
  },
  created() {
    this.$store.dispatch("contracts/fetchCalcContract");
    // this.$store.dispatch("contracts/fetchNum");
    this.$store.dispatch("contracts/storeCalcAbi");
    this.$store.dispatch("contracts/storeCalcAddress");
  },
  methods: {
    async unwrap() {
      console.log("bye")
      const web3 = new Web3(Web3.givenProvider);
      const getSelectedFromContracts = this.contracts.find(contract => contract.contract === this.selected)
      await this.getCalcContract.methods.unwrap(getSelectedFromContracts.index, web3.utils.utf8ToHex(this.newValue)).send({
        from: this.getActiveAccount
      });
    },
    async finishWrap() {
      console.log("finish me wrapping")
      const web3 = new Web3(Web3.givenProvider);
      const getSelectedFromContracts = this.contracts.find(contract => contract.contract === this.selected)
      await this.getCalcContract.methods.finishWrap(getSelectedFromContracts.index, web3.utils.utf8ToHex(this.newValue)).send({
        from: this.getActiveAccount
      });
    },
    async sendToWrapper() {
      const web3 = new Web3(Web3.givenProvider);
      console.log("Sending 2 Wrapper")
      let contract = new web3.eth.Contract(Original.abi, this.selected);
      await contract.methods.transfer(web3.utils.utf8ToHex(this.newValue), '0xe29D4943197e439274c7500fa73fd40D9695BbF3').send({
        from: this.getActiveAccount
      });
    },
    async reserveNWrap() {
      console.log("moo")
      const web3 = new Web3(Web3.givenProvider);
      const getSelectedFromContracts = this.contracts.find(contract => contract.contract === this.selected)
      await this.getCalcContract.methods.reserveViaWrapper(getSelectedFromContracts.index, web3.utils.utf8ToHex(this.newValue)).send({
        from: this.getActiveAccount
      });
    },
    async wrapExisting() {
      console.log("moo")
      const web3 = new Web3(Web3.givenProvider);
      const getSelectedFromContracts = this.contracts.find(contract => contract.contract === this.selected)
      await this.getCalcContract.methods.beginWrap(getSelectedFromContracts.index, web3.utils.utf8ToHex(this.newValue)).send({
        from: this.getActiveAccount
      });
    },
    async onSubmit() {
      const web3 = new Web3(Web3.givenProvider);
      const getSelectedFromContracts = this.contracts.find(contract => contract.contract === this.selected)
      console.log(this.getCalcContract.methods)


      let contract = new web3.eth.Contract(Original.abi, this.selected);


      const owner = await contract.methods.owner(web3.utils.utf8ToHex(this.newValue)).call();



      if (owner === '0x0000000000000000000000000000000000000000') {
        this.status = "Not registered!"
      } else {
        if (owner === '0xe29D4943197e439274c7500fa73fd40D9695BbF3') {

          this.status = 'Wrapped!';
          const combinedToken = await this.getCalcContract.methods.getCombinedTokenId(getSelectedFromContracts.index, web3.utils.utf8ToHex(this.newValue)).call()


          let ownerOf = ''
          try {
            // eslint-disable-next-line no-undef
            ownerOf = await this.getCalcContract.methods.ownerOf("0x" + BigInt(combinedToken).toString('16')).call()
            if (ownerOf.toLowerCase() === this.getActiveAccount.toLowerCase()) {
              this.status = 'Wrapped by you! Congrats!'
            } else {
              this.status = 'Someone else wrapped :('
              console.log(ownerOf)
            }

            return
          }
          catch (e) {
            console.log(e)
            ownerOf = 'waiting'
          }
          const wrapStatus = await this.getCalcContract.methods.getWrapInitializer(getSelectedFromContracts.index, web3.utils.utf8ToHex(this.newValue)).call();
          if (wrapStatus.toLowerCase() === this.getActiveAccount.toLowerCase()) {
            this.status = 'Time for the final wrap!'
          } else {
            this.status = 'Not yours home slice'
          }
        } else  if (owner.toLowerCase() === this.getActiveAccount.toLowerCase()) {
          const wrapStatus = await this.getCalcContract.methods.getWrapInitializer(getSelectedFromContracts.index, web3.utils.utf8ToHex(this.newValue)).call();
          // wrapperContract.methods.getWrapInitializer(9, web3.utils.utf8ToHex(nameToSquat)).call().then(function(res1) {
          //   console.log("wrapInit=" + res1);
          //   globalRegistrarContracts[9].methods.owner(web3.utils.utf8ToHex(nameToSquat)).call().then(function(res2) {
          //     console.log("owner=" + res2);
          //     wrapperContract.methods.getCombinedTokenId(9, web3.utils.utf8ToHex(nameToSquat)).call().then(function(res) {
          //       console.log("combined=" + BigInt(res).toString('16'));
          //       wrapperContract.methods.ownerOf("0x" + BigInt(res).toString('16')).call(function(err, res) { console.log("ownerOf=" + res); });
          //     }).catch(console.log);
          //   });
          // });


          if (wrapStatus.toLowerCase() === this.getActiveAccount.toLowerCase()) {
            this.status = 'Wrap in progress! Do step 2 now!';
          } else {
            this.status = 'You own but unwrapped!';
          }


        } else {
          this.status = 'Not Yours :('
        }
      }
    }
  },



}

</script>
