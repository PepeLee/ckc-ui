<template>
    <div class="meeting-card">
        <div class="meeting-card_wrapper">
            <div class="meeting-card_header">
                <div class="meeting-card_icon">
                    <img :src="cardImg" alt="" srcset="">
                </div>
                <div class="meeting-card_title">会议</div>
                <img v-if="meetingData.status === 'confirmed'" class="meeting-card_img"
                    src="../../assets/imgs/card/card-confirm.png" alt="">
            </div>
            <div class="meeting-card_content">
                <h3 class="meeting-card_subject" v-if="meetingData.title">{{ meetingData.title }}</h3>
                <div class="meeting-card_info-item">
                    <div class="icon-wrapper">
                        <CardDateSvg />
                    </div>
                    <div class="info-content">
                        {{ meetingData.meetingdate }} {{ meetingData.day }} {{ meetingData.startTime }} - {{
                            meetingData.endTime }}
                    </div>
                </div>

                <div class="meeting-card_info-item" v-if="meetingData.location">
                    <div class="icon-wrapper">
                        <CardLocationSvg />
                    </div>
                    <div class="info-content">{{ meetingData.location || '线上会议' }}</div>
                </div>

                <div class="meeting-card_info-item" v-if="meetingData.booker">
                    <div class="icon-wrapper">
                        <CardUserSvg />
                    </div>
                    <div class="info-content">{{ meetingData.booker || '未知发起人' }}</div>
                </div>
            </div>

            <div class="meeting-card_actions" v-if="isShowToggleBtn">
                <!-- <van-button size="small" class="btn-decline" round>拒绝</van-button> -->
                <button class="btn-accept" @click="btnClick" round>确认</button>
            </div>
            <div class="meeting-card_actions_confirmed" v-else-if="!isFirstShow">
                <component class="toast-icon" :is="successSvg" /> 已确认
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { customCardSvgIcon } from '@/utils/svgIcon'
import CardDateSvg from '../../assets/imgs/card/card-date.svg';
import CardLocationSvg from '../../assets/imgs/card/card-location.svg';
import CardUserSvg from '../../assets/imgs/card/card-user.svg';
import successSvg from '../../assets/imgs/card/success.svg'
import cardImg from '../../assets/imgs/card/cardMeeting.png'
import mitt, { type Emitter } from 'mitt';
import { computed, ref, inject } from 'vue';

interface CardEventMap {
  [event: string]: unknown;
  [event: symbol]: unknown;
  customEvent: any;
}
// 定义组件入参类型
interface MeetingCardProps {
    meetingData: {
        date: string;     // 日期 (如: 01/28)
        startTime: string;// 开始时间 (如: 10:00)
        endTime: string;  // 结束时间 (如: 11:00)
        title: string;    // 会议标题
        location: string; // 会议地点
        meetingdate?: string
        day?: string
        booker?: string
        status?: string
    };
}
const emitter = inject<Emitter<CardEventMap>>('cardEmitter', mitt<CardEventMap>());
const props = defineProps<MeetingCardProps>();
const isFirstShow = ref<boolean>(true)
const isShowToggleBtn = computed(() => {
    return isFirstShow.value && props.meetingData.status === 'pending'
})
const btnClick = () => {
    emitter.emit('meeting-card-click', { type: 'confirm', message: '会议已预定' })
    isFirstShow.value = false
}
</script>

<style lang="scss" scoped>
.meeting-card {
    margin: 12px 0;
    border-radius: 8px;
    display: flex;
    // padding: 0px 0px 12px 0px;
    gap: 12px;
    background: #FFFFFF;
    box-sizing: border-box;
    border: 1px solid #EBEDF0;
    justify-content: flex-start;
    font-family: PingFang SC;

    &_wrapper {
        width: 100%;
    }

    &_header {
        display: flex;
        height: 44px;
        border-radius: 8px 8px 0px 0px;
        flex-direction: row;
        align-items: center;
        padding: 0px 12px;
        gap: 6px;
        font-size: 16px;
        background: linear-gradient(180deg, #DBE7FF 2%, #EAF1FF 100%);

        .meeting-card_icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;

            img {
                width: 100%;
            }
        }

        .meeting-card_title {
            font-weight: 500;
            color: #17204D;
        }

        .meeting-card_img {
            position: absolute;
            right: 0;
            top: 0;
            width: 45px;
        }
    }

    &_content {
        padding: 12px;

        .meeting-card_subject {
            margin: 0 0 6px 0;
            font-size: 16px;
            font-weight: 500;
            color: #17204D;
        }

        .meeting-card_info-item {
            display: flex;
            gap: 8px;
            color: #17204D;
            font-size: 14px;
            font-weight: normal;
            padding: 5px 0;
            margin: 2px 0;

            .icon-wrapper {
                display: flex;
                align-items: center
            }

            .info-content {
                line-height: initial;
            }
        }
    }

    &_actions {
        padding: 0 16px 16px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;

        .btn-decline {
            background: #f2f3f5;
            border: none;
            color: #646566;
            padding: 0 20px;
        }

        .btn-accept {
            padding: 0px 16px;
            background: #1661F0;
            border-radius: 6px;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 600;
            color: #FFFFFF;
            height: 32px;
        }
    }

    &_actions_confirmed {
        padding: 0 16px 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
    }
}
</style>