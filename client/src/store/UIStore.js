import { makeAutoObservable } from "mobx";

class UIStore {
  isSidebarOpen = true; 
  isLoading = false;    

  constructor() {
    makeAutoObservable(this);
  }

  setIsSidebarOpen(isSidebarOpen) {
    this.isSidebarOpen = isSidebarOpen;
  }

  setIsLoading(isLoading) {
    this.isLoading = isLoading;
  }
}

export default UIStore;
