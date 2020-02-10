import * as React from 'react';
import { Animated, Easing, ImageSourcePropType, StyleProp, View, ViewStyle } from 'react-native';
import style from './style';

export interface ISlide {
	imageSource: ImageSourcePropType;
}

interface IState {
	nextSlideOpacity: Animated.Value;
	currentImageScale: Animated.Value;
	nextImageScale: Animated.Value;
	currentIndex: number;
	nextIndex: number;
}

export interface IProps {
	fadeDuration: number;
	startAnimation: boolean;
	stillDuration: number;
	slides: ISlide[];
	scaleFrom: number;
	scaleTo: number;
	styles: {
		background?: StyleProp<ViewStyle>;
		slide?: StyleProp<ViewStyle>;
		wrapper?: StyleProp<ViewStyle>;
	};
}

export default class FadeCarousel extends React.PureComponent<IProps, IState> {

	static defaultProps = {
		fadeDuration: 1000,
		scaleFrom: 1,
		scaleTo: 1.05,
		startAnimation: true,
		stillDuration: 1000,
		styles: {},
	};

	mounted: boolean = true;

	timeout?: NodeJS.Timeout;

	state: IState = {
		nextSlideOpacity: new Animated.Value(0),
		currentImageScale: new Animated.Value(0),
		nextImageScale: new Animated.Value(0),
		currentIndex: 0,
		nextIndex: 1,
	};

	componentDidMount() {
		this.scaleCurrentImage();

		if (this.props.startAnimation) {
			this.wait(this.showNextSlide);
		}
	}

	componentWillUnmount() {
		this.mounted = false;

		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	}

	scaleCurrentImage = () => {
		Animated.timing(this.state.currentImageScale, {
			toValue: 1,
			duration: this.props.fadeDuration + this.props.stillDuration,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start();
	}

	scaleNextImage = () => {
		Animated.timing(this.state.nextImageScale, {
			toValue: 0.1,
			duration: this.props.fadeDuration / 2,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start();
	}

	showNextSlide = () => {
		Animated.timing(this.state.nextSlideOpacity, {
			toValue: 1,
			easing: Easing.circle,
			duration: this.props.fadeDuration,
			useNativeDriver: true,
		}).start(() => {
			this.changeSlide();
		});
	}

	wait = (cb: () => void) => {
		Animated.delay(this.props.stillDuration).start(cb);
	}

	changeSlide = () => {
		if (!this.mounted) {
			return;
		}

		let newCurrentIndex = this.state.currentIndex + 1;
		let newNextIndex = this.state.nextIndex + 1;

		newCurrentIndex = newCurrentIndex < this.props.slides.length ? newCurrentIndex : 0;
		newNextIndex = newNextIndex < this.props.slides.length ? newNextIndex : 0;

		if (this.props.startAnimation) {
			this.setState({
				currentIndex: newCurrentIndex,
				nextIndex: newCurrentIndex,
			}, () => {
				this.state.currentImageScale.setValue(0.1);
				this.scaleNextImage();
				this.timeout = setTimeout(() => {
					if (this.mounted) {
						this.state.nextImageScale.setValue(0);
						this.scaleCurrentImage();
						this.state.nextSlideOpacity.setValue(0);
						this.setState({ nextIndex: newNextIndex });
					}
				}, this.props.fadeDuration / 2);
				this.wait(this.showNextSlide);
			});
		}
	}

	renderSlide = (slide: ISlide, isCurrentSlide: boolean) => {
		const { styles } = this.props;
		const animateOpacity = isCurrentSlide ? 1 : this.state.nextSlideOpacity;
		const animScaleKey = isCurrentSlide ? 'currentImageScale' : 'nextImageScale';

		const imageScale = this.state[animScaleKey].interpolate({
			inputRange: [0, 1],
			outputRange: [this.props.scaleFrom, this.props.scaleTo],
		});

		return (
			<Animated.View style={[style.slide, styles.slide, { opacity: animateOpacity }]}>
				<Animated.Image
					style={[style.background, styles.background, { transform: [{ scaleX: imageScale }, { scaleY: imageScale }] }]}
					source={slide.imageSource}
					resizeMode="cover"
				/>
			</Animated.View>
		);
	}

	render() {
		const {
			slides,
			styles,
		} = this.props;
		const currentSlide = slides[this.state.currentIndex];
		const nextSlide = slides[this.state.nextIndex];

		return (
			<View style={[style.wrapper, styles.wrapper]}>
				{this.renderSlide(currentSlide, true)}
				{this.renderSlide(nextSlide, false)}
			</View>
		);
	}
}
