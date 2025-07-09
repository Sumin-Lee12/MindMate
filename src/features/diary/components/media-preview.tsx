import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Video, Mic, X } from 'lucide-react-native';
import { Colors } from '../../../constants/colors';
import { DiaryMediaType } from '../types';

type MediaPreviewProps = {
  media: DiaryMediaType[];
  onRemove: (id: string) => void;
};

/**
 * 첨부된 미디어 미리보기 컴포넌트
 */
const MediaPreview = ({ media, onRemove }: MediaPreviewProps) => {
  if (media.length === 0) return null;

  return (
    <ScrollView horizontal className="px-4 pb-4" showsHorizontalScrollIndicator={false}>
      {media.map((item) => (
        <View key={item.id} className="relative mr-2 h-20 w-20">
          {item.type === 'image' ? (
            <Image
              source={{ uri: item.uri }}
              className="h-full w-full rounded-lg"
              resizeMode="cover"
            />
          ) : item.type === 'video' ? (
            <View className="h-full w-full items-center justify-center rounded-lg bg-gray">
              <Video size={32} color={Colors.white} />
            </View>
          ) : (
            <View className="h-full w-full items-center justify-center rounded-lg bg-gray">
              <Mic size={32} color={Colors.white} />
            </View>
          )}
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            className="bg-red absolute -right-0 -top-0 h-6 w-6 items-center justify-center rounded-full"
          >
            <X size={12} color={Colors.black} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default MediaPreview;
