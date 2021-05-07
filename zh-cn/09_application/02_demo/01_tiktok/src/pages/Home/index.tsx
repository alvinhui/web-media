import { createElement, Component } from 'rax';
import View from 'rax-view';
import Image from 'rax-image';
import {Swiper, SwiperSlide} from 'rax-swiper';
import styles from './index.module.css';

export default class App extends Component {
  render() {
    return (
      <View>
        <Swiper
          className={styles.slider}
          autoplay={false}
          pagination={false}
          vertical={true}
          direction="vertical"
        >
          <SwiperSlide>
            <View className={styles.itemWrap}>
              <Image
                className={styles.image}
                source={{
                  uri:
                    '//gw.alicdn.com/tfs/TB19NbqKFXXXXXLXVXXXXXXXXXX-750-500.png',
                }}
              />
            </View>
          </SwiperSlide>
          <SwiperSlide>
            <View className={styles.itemWrap}>
              <Image
                className={styles.image}
                source={{
                  uri:
                    '//gw.alicdn.com/tfs/TB1tWYBKFXXXXatXpXXXXXXXXXX-750-500.png',
                }}
              />
            </View>
          </SwiperSlide>
          <SwiperSlide>
            <View className={styles.itemWrap}>
              <Image
                className={styles.image}
                source={{
                  uri:
                    '//gw.alicdn.com/tfs/TB1SX_vKFXXXXbyXFXXXXXXXXXX-750-500.png',
                }}
              />
            </View>
          </SwiperSlide>
        </Swiper>
      </View>
    );
  }
}