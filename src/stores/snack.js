import { defineStore } from 'pinia'
import HTTP_RESPONSE from "@/services/exceptions"
import { successCodes } from '../constants';


const useSnackStore = defineStore(`snack`, {
  state: () => ({
    form: {},
    isOpen: false
  }),
  actions: {
    showMessage(response) {
      this.setControls(1, null);
      if (response) {
        this.setControls(
          successCodes.includes(response.status) ? 1 : -1,
          HTTP_RESPONSE.parse(response)
        );
        this.isOpen = true;
      }
    },
    hideSnack() {
      this.setControls(0, null);
      this.isOpen = false;
    },
    setControls(status, name) {
      this.form.message = name;
      this.form.status = status;
      this.isOpen = false;
    }
  },
});

export default useSnackStore;