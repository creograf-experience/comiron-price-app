import { createStackNavigator } from "react-navigation-stack";
import { 
  MAIN_CHAT_LIST_SCREEN, 
  SHOP_CHAT_LIST_SCREEN, 
  ACTIVE_CHAT_SCREEN, 
  IMAGE_FULL_SCREEN,
  CONTACTS_SCREEN
} from "../constants";
import { MainChatListScreen } from '../screens/MainChatListScreen';
import { ShopChatListScreen} from '../screens/ShopChatListScreen';
import { ActiveChatScreen } from '../screens/ActiveChatScreen';
import { ImageFullScreen } from '../screens/ImageFullScreen';
import { ContactsScreen } from "../screens/ContactsScreen";

const ChatStack = createStackNavigator(
  {
    [MAIN_CHAT_LIST_SCREEN]: {
      screen: MainChatListScreen
    },
    [CONTACTS_SCREEN]: {
      screen: ContactsScreen
    },
    [SHOP_CHAT_LIST_SCREEN]: {
      screen: ShopChatListScreen
    },
    [ACTIVE_CHAT_SCREEN]: {
      screen: ActiveChatScreen
    },
    [IMAGE_FULL_SCREEN]:{
      screen: ImageFullScreen
    }
  },
  {
    initialRouteName: MAIN_CHAT_LIST_SCREEN
  }
);

export default ChatStack;