import { makeAutoObservable } from "mobx";

export default class User {
  constructor() {
    this._isAuth = false;
    this._user = {};
    this._role = "";
    this._currentPath = ""; // зберігаємо шлях
    makeAutoObservable(this);
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }

  setUser(user) {
    this._user = user;
  }

  setRole(role) {
    this._role = role;
  }

  setCurrentPath(path) {
    this._currentPath = path;
  }

  get isAuth() {
    return this._isAuth;
  }

  get user() {
    return this._user;
  }

  get role() {
    return this._role;
  }

  get currentPath() {
    return this._currentPath;
  }
}
