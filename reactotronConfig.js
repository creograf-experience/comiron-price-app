import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

export default Reactotron.configure({ host: "192.168.0.16" }) //for use reactotron you need to specify your local IP
  .useReactNative()
  .use(reactotronRedux())
  .connect();
