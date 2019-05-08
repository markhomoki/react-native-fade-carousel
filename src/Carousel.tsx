import * as React from 'react';
import { View } from 'react-native';
import { ICarouselProps } from './types';
import style from './style';

export default class Carousel extends React.PureComponent<ICarouselProps> {

    render() {
        return (
            <View style={style.wrapper} />
        );
    }
}
