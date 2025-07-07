import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pencil, Trash } from 'lucide-react-native';

/**
 * 루틴 리스트 카드 컴포넌트
 * @param title - 루틴 이름
 * @param time - 시간
 * @param duration - 기간/소요시간
 * @param onEdit - 편집 아이콘 클릭 시 콜백
 * @param onDelete - 삭제 아이콘 클릭 시 콜백
 * @param className - 추가 스타일 클래스
 */
type RoutineListCardProps = {
  title: string;
  time: string;
  duration: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

const RoutineListCard = ({
  title,
  time,
  duration,
  onEdit,
  onDelete,
  className = '',
}: RoutineListCardProps) => {
  return (
    <View
      className={`mb-3 flex-row items-stretch rounded-xl bg-white shadow-dropShadow ${className}`}
    >
      {/* 좌측 색상 bar */}
      <View className="w-2 rounded-l-xl bg-paleCobalt" />
      {/* 내용 */}
      <View className="flex-1 p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-base font-bold text-paleCobalt">{title}</Text>
            <Text className="text-xs text-gray">
              {time} ~{duration}
            </Text>
          </View>
          <View className="ml-2 flex-row items-center">
            {onEdit && (
              <TouchableOpacity onPress={onEdit} className="mr-2">
                <Pencil size={18} color="#576BCD" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete}>
                <Trash size={18} color="#576BCD" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default RoutineListCard;
