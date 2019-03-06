import { createStackNavigator, createAppContainer } from 'react-navigation';
import LogIn from '../src/screens/login/authentication'
import Home from '../src/screens/dashboard/dashboard'
import AddCircle from '../src/screens/creat Circle/CreatCircle'
import CircleDetail from '../src/screens/circleDetail/CircleDetails'
import Request from '../src/screens/addUser/AddUser'
import EnterCode from '../src/screens/joinCircle/JoinCircle'
const StackNavigator = createStackNavigator({
    LogIn: {
        screen: LogIn
    },
    Home: {
        screen: Home
    },
    AddCircle:{
        screen:AddCircle
    },
    CircleDetail:{
        screen:CircleDetail
    },
    Request:{
        screen:Request
    },
    EnterCode:{
        screen:EnterCode
    }


});



const Navigation = createAppContainer(StackNavigator)
export default Navigation;