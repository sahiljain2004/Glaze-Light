import { createNavigationContainerRef } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

export default navigationRef;
