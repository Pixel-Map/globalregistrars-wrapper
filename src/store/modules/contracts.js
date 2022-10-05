import Calc from "../../contracts/Calc.json";
import addresses from "../../contracts/addresses.json";
import Web3 from "web3";

const state = {
  num: 0,
  calcAbi: null,
  calcAddress: null,
  calcContract: null
};

const getters = {
  getNum(state) {
    return state.num;
  },
  getCalcAbi(state) {
    return state.calcAbi;
  },
  getCalcAddress(state) {
    return state.calcAddress;
  },
  getCalcContract(state) {
    return state.calcContract;
  }
};
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
const actions = {
  async fetchCalcContract({ commit, rootState }) {
    await  delay(1000);

    const web3 = new Web3(Web3.givenProvider);
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let calcAddress = addresses.Calc[chainIdDec];


    let contract = new web3.eth.Contract(Calc.abi, calcAddress);

    commit("setCalcContract", contract);
  },
  async fetchNum({ commit, state }) {

    if (!state.calcContract) {
      await this.fetchCalcContract();
    }
    console.log(state.calcContract.methods)
    let num = await state.calcContract.methods.owner(  "0x82b96b28F70F79200141F46BD5674b2Bb252bE0C").call();

    commit("setNum", num);
  },
  storeCalcAbi({commit}) {
    commit("setCalcAbi", Calc.abi);
  },
  storeCalcAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let calcAddress = addresses.Calc[chainIdDec];

    commit("setCalcAddress", calcAddress);
  }
};

const mutations = {
  setNum(state, _num) {
    state.num = _num;
  },
  setCalcAbi(state, abi) {
    state.calcAbi = abi;
  },
  setCalcAddress(state, address) {
    state.calcAddress = address;
  },
  setCalcContract(state, _contract) {
    state.calcContract = _contract;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
