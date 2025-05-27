import { makeAutoObservable } from "mobx";

export default class Hospital {
  constructor() {
    this._hospital = localStorage.getItem('hospital')|| {}; 
    makeAutoObservable(this);
  }

  setHospital(hospital) {
    this._hospital = hospital;
  }

  get hospital() {
    return this._hospital;
  }

  get hospitalId() {
    return this._hospital?.id || null;
  }

}
