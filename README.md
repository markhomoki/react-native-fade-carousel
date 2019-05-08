# react-native-fade-carousel
Fade image carousel component for React Native. Compatible with iOS and Android.

## Usage

```bash
# Install 
yarn add react-native-fade-carousel
# Or
npm i react-native-fade-carousel --save-dev
```
```jsx
import FadeCarousel from 'react-native-fade-carousel';

const YourCarousel = () => (
    <FadeCarousel
        style={styles.carousel}
        slides={[
            { uri: 'https://picsum.photos/id/1/400/400' },
            { uri: 'https://picsum.photos/id/2/400/400' },
            { uri: 'https://picsum.photos/id/3/400/400' },
        ]}
        resizeMode={FastImage.resizeMode.contain}
    />
);
```
