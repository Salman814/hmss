from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from appointments.models import Ward

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.role not in ['ADMIN', 'DOCTOR']:
            raise serializers.ValidationError('Login is allowed only for admin and doctor')
        data['role'] = self.user.role
        return data

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', required=False, allow_blank=True)
    ward_id = serializers.PrimaryKeyRelatedField(
        queryset=Ward.objects.all(),
        source='assigned_ward',
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'name',
            'email',
            'phone_number',
            'role',
            'ward_id',
            'assigned_ward',
            'bed_number'
        )
        read_only_fields = ('assigned_ward',)

class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    ward_id = serializers.PrimaryKeyRelatedField(
        queryset=Ward.objects.all(),
        source='assigned_ward',
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'name',
            'email',
            'phone_number',
            'role',
            'password',
            'ward_id',
            'bed_number'
        )

    def validate(self, attrs):
        role = attrs.get('role', 'PATIENT')
        if self.instance is None and role != 'PATIENT' and not attrs.get('password'):
            raise serializers.ValidationError('Password is required for new users')
        assigned_ward = attrs.get('assigned_ward')
        bed_number = attrs.get('bed_number')

        if role == 'WARD':
            raise serializers.ValidationError('Ward users are disabled')

        if role != 'PATIENT':
            if assigned_ward or bed_number:
                raise serializers.ValidationError('Ward assignment is only for patients')

        if role == 'PATIENT' and assigned_ward:
            if bed_number is None:
                raise serializers.ValidationError('Bed number is required when assigning a ward')
            if bed_number < 1 or bed_number > assigned_ward.total_beds:
                raise serializers.ValidationError('Bed number must be within ward capacity')

        return attrs

    def create(self, validated_data):
        assigned_ward = validated_data.pop('assigned_ward', None)
        bed_number = validated_data.pop('bed_number', None)
        if not validated_data.get('username'):
            validated_data['username'] = validated_data.get('email', '')

        password = validated_data.pop('password', None)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'PATIENT'),
            password=password if password else None
        )
        if 'first_name' in validated_data:
            user.first_name = validated_data.get('first_name', '')
        if 'phone_number' in validated_data:
            user.phone_number = validated_data.get('phone_number', '')

        if user.role == 'PATIENT' and assigned_ward:
            if User.objects.filter(assigned_ward=assigned_ward, bed_number=bed_number).exists():
                raise serializers.ValidationError('Bed is already assigned')
            user.assigned_ward = assigned_ward
            user.bed_number = bed_number
            assigned_ward.occupied_beds = User.objects.filter(assigned_ward=assigned_ward).count() + 1
            assigned_ward.save()

        user.save()
        return user

    def update(self, instance, validated_data):
        old_ward = instance.assigned_ward
        assigned_ward = validated_data.pop('assigned_ward', None)
        bed_number = validated_data.pop('bed_number', None)

        for field in ['username', 'email', 'role', 'first_name', 'phone_number']:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        if instance.role != 'PATIENT':
            instance.assigned_ward = None
            instance.bed_number = None
        elif assigned_ward or bed_number is not None:
            if assigned_ward is None:
                assigned_ward = instance.assigned_ward
            if bed_number is None:
                bed_number = instance.bed_number
            if assigned_ward and bed_number:
                if bed_number < 1 or bed_number > assigned_ward.total_beds:
                    raise serializers.ValidationError('Bed number must be within ward capacity')
                if User.objects.filter(assigned_ward=assigned_ward, bed_number=bed_number).exclude(pk=instance.pk).exists():
                    raise serializers.ValidationError('Bed is already assigned')
                instance.assigned_ward = assigned_ward
                instance.bed_number = bed_number

        instance.save()

        if old_ward and old_ward != assigned_ward:
            old_ward.occupied_beds = User.objects.filter(assigned_ward=old_ward).count()
            old_ward.save()

        if instance.assigned_ward:
            instance.assigned_ward.occupied_beds = User.objects.filter(assigned_ward=instance.assigned_ward).count()
            instance.assigned_ward.save()

        return instance
