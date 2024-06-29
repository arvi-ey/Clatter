import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Authprovider from './components/Context/Authprovider';
import ContactProvider from './components/Context/Contactprovider';
import Initialpage from './components/Initialpage';

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Authprovider>
        <ContactProvider>
          <Initialpage />
        </ContactProvider>
      </Authprovider>
    </GestureHandlerRootView>
  );
}
