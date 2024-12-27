import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";
import { errorCodes, successCodes } from "../constants";
import useLoginStore from "@/stores/login";

function parse(response) {
  try {
    if (response.status) {
      var reposeMessage = "";
      var statusCode = response.status;
      if (statusCode == 401) {
        const loginStore = useLoginStore();
        loginStore.logout();
        return;
      }
      if (successCodes.includes(statusCode))
        reposeMessage = SUCCESS_MESSAGES[statusCode];
      else if (errorCodes.includes(statusCode)) {
        for (var i in response.data) {
          reposeMessage += response.data[i];
          break;
        }
      } else reposeMessage = ERROR_MESSAGES[statusCode];
    } else reposeMessage = "Network error. Check your connection.";
  } catch (response) {
    reposeMessage = "Unknown exception occurred.";
  }
  return reposeMessage;
}

export default {
  parse,
};
