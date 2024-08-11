import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Authprovider from './components/Context/Authprovider';
import ContactProvider from './components/Context/Contactprovider';
import Messageprovider from './components/Context/Messageprovider';
import Initialpage from './components/Initialpage';

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Authprovider>
        <ContactProvider>
          <Messageprovider>
            <Initialpage />
          </Messageprovider>
        </ContactProvider>
      </Authprovider>
    </GestureHandlerRootView>
  );
}