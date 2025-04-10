PGDMP     '    3                |            database_name    14.2 (Debian 14.2-1.pgdg110+1)    15.0 B    L           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            M           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            N           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            O           1262    16506    database_name    DATABASE     x   CREATE DATABASE database_name WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE database_name;
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            P           1247    16543    device_capability_type_enum    TYPE     b   CREATE TYPE public.device_capability_type_enum AS ENUM (
    'scheduled',
    'sent_to_device'
);
 .   DROP TYPE public.device_capability_type_enum;
       public          postgres    false    4            b           1247    24649    program_version_enum    TYPE     H   CREATE TYPE public.program_version_enum AS ENUM (
    'v1',
    'v2'
);
 '   DROP TYPE public.program_version_enum;
       public          postgres    false    4            �            1259    16563    device    TABLE     �  CREATE TABLE public.device (
    "deviceUid" character varying(255) NOT NULL,
    "deviceName" character varying(255) NOT NULL,
    image character varying(255) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    "lastSeenDate" timestamp without time zone NOT NULL,
    "registrationDate" timestamp without time zone DEFAULT now() NOT NULL,
    description character varying(1024) NOT NULL,
    "typeId" integer
);
    DROP TABLE public.device;
       public         heap    postgres    false    4            �            1259    16548    device_capability    TABLE     �   CREATE TABLE public.device_capability (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type public.device_capability_type_enum NOT NULL,
    parameters json,
    "deviceDeviceUid" character varying(255)
);
 %   DROP TABLE public.device_capability;
       public         heap    postgres    false    848    4            �            1259    16547    device_capability_id_seq    SEQUENCE     �   CREATE SEQUENCE public.device_capability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.device_capability_id_seq;
       public          postgres    false    217    4            P           0    0    device_capability_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.device_capability_id_seq OWNED BY public.device_capability.id;
          public          postgres    false    216            �            1259    16536    device_type    TABLE     g   CREATE TABLE public.device_type (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);
    DROP TABLE public.device_type;
       public         heap    postgres    false    4            �            1259    16535    device_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.device_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.device_type_id_seq;
       public          postgres    false    215    4            Q           0    0    device_type_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.device_type_id_seq OWNED BY public.device_type.id;
          public          postgres    false    214            �            1259    16557    group    TABLE     c   CREATE TABLE public."group" (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);
    DROP TABLE public."group";
       public         heap    postgres    false    4            �            1259    16571    group_devices_device    TABLE     �   CREATE TABLE public.group_devices_device (
    "groupId" integer NOT NULL,
    "deviceDeviceUid" character varying(255) NOT NULL
);
 (   DROP TABLE public.group_devices_device;
       public         heap    postgres    false    4            �            1259    16556    group_id_seq    SEQUENCE     �   CREATE SEQUENCE public.group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.group_id_seq;
       public          postgres    false    4    219            R           0    0    group_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.group_id_seq OWNED BY public."group".id;
          public          postgres    false    218            �            1259    16513    parameter_type    TABLE     1  CREATE TABLE public.parameter_type (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    label character varying NOT NULL,
    units character varying(255) DEFAULT '°C'::character varying NOT NULL,
    threshold1 double precision NOT NULL,
    threshold2 double precision NOT NULL,
    type character varying(255) NOT NULL,
    min double precision DEFAULT '0'::double precision NOT NULL,
    max double precision DEFAULT '0'::double precision NOT NULL,
    "measurementsPerMinute" double precision DEFAULT '4'::double precision NOT NULL
);
 "   DROP TABLE public.parameter_type;
       public         heap    postgres    false    4            �            1259    16512    parameter_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.parameter_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.parameter_type_id_seq;
       public          postgres    false    211    4            S           0    0    parameter_type_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.parameter_type_id_seq OWNED BY public.parameter_type.id;
          public          postgres    false    210            �            1259    16526    parameter_value    TABLE     �   CREATE TABLE public.parameter_value (
    id integer NOT NULL,
    number double precision,
    string character varying,
    visibility integer DEFAULT 3 NOT NULL,
    "typeId" integer,
    "deviceDeviceUid" character varying(255)
);
 #   DROP TABLE public.parameter_value;
       public         heap    postgres    false    4            �            1259    16525    parameter_value_id_seq    SEQUENCE     �   CREATE SEQUENCE public.parameter_value_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.parameter_value_id_seq;
       public          postgres    false    4    213            T           0    0    parameter_value_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.parameter_value_id_seq OWNED BY public.parameter_value.id;
          public          postgres    false    212            �            1259    16609    program    TABLE     �   CREATE TABLE public.program (
    id integer NOT NULL,
    data jsonb NOT NULL,
    "groupId" integer,
    name character varying(255) NOT NULL,
    version public.program_version_enum DEFAULT 'v1'::public.program_version_enum NOT NULL
);
    DROP TABLE public.program;
       public         heap    postgres    false    866    866    4            �            1259    16608    program_id_seq    SEQUENCE     �   CREATE SEQUENCE public.program_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.program_id_seq;
       public          postgres    false    4    223            U           0    0    program_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.program_id_seq OWNED BY public.program.id;
          public          postgres    false    222            �            1259    16507    typeorm_metadata    TABLE     �   CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);
 $   DROP TABLE public.typeorm_metadata;
       public         heap    postgres    false    4            �           2604    16551    device_capability id    DEFAULT     |   ALTER TABLE ONLY public.device_capability ALTER COLUMN id SET DEFAULT nextval('public.device_capability_id_seq'::regclass);
 C   ALTER TABLE public.device_capability ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            �           2604    16539    device_type id    DEFAULT     p   ALTER TABLE ONLY public.device_type ALTER COLUMN id SET DEFAULT nextval('public.device_type_id_seq'::regclass);
 =   ALTER TABLE public.device_type ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            �           2604    16560    group id    DEFAULT     f   ALTER TABLE ONLY public."group" ALTER COLUMN id SET DEFAULT nextval('public.group_id_seq'::regclass);
 9   ALTER TABLE public."group" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            �           2604    16516    parameter_type id    DEFAULT     v   ALTER TABLE ONLY public.parameter_type ALTER COLUMN id SET DEFAULT nextval('public.parameter_type_id_seq'::regclass);
 @   ALTER TABLE public.parameter_type ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    210    211            �           2604    16529    parameter_value id    DEFAULT     x   ALTER TABLE ONLY public.parameter_value ALTER COLUMN id SET DEFAULT nextval('public.parameter_value_id_seq'::regclass);
 A   ALTER TABLE public.parameter_value ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    213    213            �           2604    16612 
   program id    DEFAULT     h   ALTER TABLE ONLY public.program ALTER COLUMN id SET DEFAULT nextval('public.program_id_seq'::regclass);
 9   ALTER TABLE public.program ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222    223            F          0    16563    device 
   TABLE DATA                 public          postgres    false    220   jO       C          0    16548    device_capability 
   TABLE DATA                 public          postgres    false    217   �P       A          0    16536    device_type 
   TABLE DATA                 public          postgres    false    215   �Q       E          0    16557    group 
   TABLE DATA                 public          postgres    false    219   OR       G          0    16571    group_devices_device 
   TABLE DATA                 public          postgres    false    221   �R       =          0    16513    parameter_type 
   TABLE DATA                 public          postgres    false    211   5S       ?          0    16526    parameter_value 
   TABLE DATA                 public          postgres    false    213   qT       I          0    16609    program 
   TABLE DATA                 public          postgres    false    223   YU       ;          0    16507    typeorm_metadata 
   TABLE DATA                 public          postgres    false    209   �V       V           0    0    device_capability_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.device_capability_id_seq', 2, true);
          public          postgres    false    216            W           0    0    device_type_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.device_type_id_seq', 2, true);
          public          postgres    false    214            X           0    0    group_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.group_id_seq', 3, true);
          public          postgres    false    218            Y           0    0    parameter_type_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.parameter_type_id_seq', 6, true);
          public          postgres    false    210            Z           0    0    parameter_value_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.parameter_value_id_seq', 9, true);
          public          postgres    false    212            [           0    0    program_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.program_id_seq', 2, true);
          public          postgres    false    222            �           2606    16562 $   group PK_256aa0fda9b1de1a73ee0b7106b 
   CONSTRAINT     f   ALTER TABLE ONLY public."group"
    ADD CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."group" DROP CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b";
       public            postgres    false    219            �           2606    16616 &   program PK_3bade5945afbafefdd26a3a29fb 
   CONSTRAINT     f   ALTER TABLE ONLY public.program
    ADD CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.program DROP CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb";
       public            postgres    false    223            �           2606    16534 .   parameter_value PK_44821e6332d33d4958ceb24bf93 
   CONSTRAINT     n   ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "PK_44821e6332d33d4958ceb24bf93" PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.parameter_value DROP CONSTRAINT "PK_44821e6332d33d4958ceb24bf93";
       public            postgres    false    213            �           2606    16524 -   parameter_type PK_9172edfe1e2548d58309cc2089d 
   CONSTRAINT     m   ALTER TABLE ONLY public.parameter_type
    ADD CONSTRAINT "PK_9172edfe1e2548d58309cc2089d" PRIMARY KEY (id);
 Y   ALTER TABLE ONLY public.parameter_type DROP CONSTRAINT "PK_9172edfe1e2548d58309cc2089d";
       public            postgres    false    211            �           2606    16570 %   device PK_b97f4d1b3e1ba733d0463013e5b 
   CONSTRAINT     n   ALTER TABLE ONLY public.device
    ADD CONSTRAINT "PK_b97f4d1b3e1ba733d0463013e5b" PRIMARY KEY ("deviceUid");
 Q   ALTER TABLE ONLY public.device DROP CONSTRAINT "PK_b97f4d1b3e1ba733d0463013e5b";
       public            postgres    false    220            �           2606    16555 0   device_capability PK_bdf4f947a806abb2b6ac30a6bfa 
   CONSTRAINT     p   ALTER TABLE ONLY public.device_capability
    ADD CONSTRAINT "PK_bdf4f947a806abb2b6ac30a6bfa" PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.device_capability DROP CONSTRAINT "PK_bdf4f947a806abb2b6ac30a6bfa";
       public            postgres    false    217            �           2606    16575 3   group_devices_device PK_c33f6fa16edb7af96e61fc6be16 
   CONSTRAINT     �   ALTER TABLE ONLY public.group_devices_device
    ADD CONSTRAINT "PK_c33f6fa16edb7af96e61fc6be16" PRIMARY KEY ("groupId", "deviceDeviceUid");
 _   ALTER TABLE ONLY public.group_devices_device DROP CONSTRAINT "PK_c33f6fa16edb7af96e61fc6be16";
       public            postgres    false    221    221            �           2606    16541 *   device_type PK_f8d1c0daa8abde339c1056535a0 
   CONSTRAINT     j   ALTER TABLE ONLY public.device_type
    ADD CONSTRAINT "PK_f8d1c0daa8abde339c1056535a0" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.device_type DROP CONSTRAINT "PK_f8d1c0daa8abde339c1056535a0";
       public            postgres    false    215            �           1259    16576    IDX_620224bf54ad30d1e2cc825e1b    INDEX     f   CREATE INDEX "IDX_620224bf54ad30d1e2cc825e1b" ON public.group_devices_device USING btree ("groupId");
 4   DROP INDEX public."IDX_620224bf54ad30d1e2cc825e1b";
       public            postgres    false    221            �           1259    16577    IDX_82ad17ebb736411b251b4ab9ea    INDEX     n   CREATE INDEX "IDX_82ad17ebb736411b251b4ab9ea" ON public.group_devices_device USING btree ("deviceDeviceUid");
 4   DROP INDEX public."IDX_82ad17ebb736411b251b4ab9ea";
       public            postgres    false    221            �           2606    16583 .   parameter_value FK_0147def6301bbce380fc1051d27    FK CONSTRAINT     �   ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "FK_0147def6301bbce380fc1051d27" FOREIGN KEY ("deviceDeviceUid") REFERENCES public.device("deviceUid");
 Z   ALTER TABLE ONLY public.parameter_value DROP CONSTRAINT "FK_0147def6301bbce380fc1051d27";
       public          postgres    false    220    3234    213            �           2606    16593 %   device FK_1d9d3cdfc95b3b64bcd33f414de    FK CONSTRAINT     �   ALTER TABLE ONLY public.device
    ADD CONSTRAINT "FK_1d9d3cdfc95b3b64bcd33f414de" FOREIGN KEY ("typeId") REFERENCES public.device_type(id);
 Q   ALTER TABLE ONLY public.device DROP CONSTRAINT "FK_1d9d3cdfc95b3b64bcd33f414de";
       public          postgres    false    3228    220    215            �           2606    16588 0   device_capability FK_4a0a575339c16c07a9943b3c4bc    FK CONSTRAINT     �   ALTER TABLE ONLY public.device_capability
    ADD CONSTRAINT "FK_4a0a575339c16c07a9943b3c4bc" FOREIGN KEY ("deviceDeviceUid") REFERENCES public.device("deviceUid");
 \   ALTER TABLE ONLY public.device_capability DROP CONSTRAINT "FK_4a0a575339c16c07a9943b3c4bc";
       public          postgres    false    3234    217    220            �           2606    16598 3   group_devices_device FK_620224bf54ad30d1e2cc825e1b6    FK CONSTRAINT     �   ALTER TABLE ONLY public.group_devices_device
    ADD CONSTRAINT "FK_620224bf54ad30d1e2cc825e1b6" FOREIGN KEY ("groupId") REFERENCES public."group"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.group_devices_device DROP CONSTRAINT "FK_620224bf54ad30d1e2cc825e1b6";
       public          postgres    false    219    3232    221            �           2606    16617 &   program FK_6722c8391f9a6afb2c90ebf63b3    FK CONSTRAINT     �   ALTER TABLE ONLY public.program
    ADD CONSTRAINT "FK_6722c8391f9a6afb2c90ebf63b3" FOREIGN KEY ("groupId") REFERENCES public."group"(id);
 R   ALTER TABLE ONLY public.program DROP CONSTRAINT "FK_6722c8391f9a6afb2c90ebf63b3";
       public          postgres    false    3232    223    219            �           2606    16603 3   group_devices_device FK_82ad17ebb736411b251b4ab9ea1    FK CONSTRAINT     �   ALTER TABLE ONLY public.group_devices_device
    ADD CONSTRAINT "FK_82ad17ebb736411b251b4ab9ea1" FOREIGN KEY ("deviceDeviceUid") REFERENCES public.device("deviceUid");
 _   ALTER TABLE ONLY public.group_devices_device DROP CONSTRAINT "FK_82ad17ebb736411b251b4ab9ea1";
       public          postgres    false    220    221    3234            �           2606    16578 .   parameter_value FK_e5a4fbd175719accfb774a16ecb    FK CONSTRAINT     �   ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "FK_e5a4fbd175719accfb774a16ecb" FOREIGN KEY ("typeId") REFERENCES public.parameter_type(id);
 Z   ALTER TABLE ONLY public.parameter_value DROP CONSTRAINT "FK_e5a4fbd175719accfb774a16ecb";
       public          postgres    false    211    213    3224            F   d  x����O�0�;��.@�-m�QēF�=���Ѹ_�:���`�"F�Lv���no���4��L�7P֫TFn,62гv���-�Ŕg�T2㉰!�Z�:nVE��V�+
�_q�d-%Yie���^,�Hɲ�1�\� ��pw1Y�C�uwÖ���^׆n�q��6� M]J(��*Rm*�>b������D��<�@Ј��(syl�����,�õ��Z䦁���Ե���-�\��Aru���Dnd���(��"�:�|-TVT��O�<��b�0��z��w�Z�ݥ��΍��ۖ�x
Bm�Jh��إu��}�tof�?ߛ����"o�0���ɃLM�w*G&x��y���3      C   �   x���A��0��>E�e
��7=	�0x����ѵAs�6UD��v�����%%���#�"K�+H��]Q���x&����,�$�t�<b|�}������n~��5i1���o�d0�#3����드O�~%ۛh��	ˆ���kϲtm�hY�w����H�p8�o�G�^P�u�7=s���9�}��_���X����nm�������[      A   z   x���v
Q���W((M��L�KI-�LN�/�,HU��L�Q�K�M�Ts�	uV�0�QP�M,*Q�)MW״��$�#�!�E���%�%�d4)<�$�H!(�$5�$3?O!$1/d n�E-      E   d   x���v
Q���W((M��L�SJ/�/-PR��L�Q�K�M�Ts�	uV�0�QP��,��KW���U״��$� #�N�)Edi6j��,I�H�i�� ��6�      G   b   x���v
Q���W((M��L�K/�/-�OI-�LN-��
J`a�%%����LQ�Ts�	uV�0�QP��Ɨf���kZsyR�
��k2�� �,XS      =   ,  x����J�@�{�b(ȶ�j��*x�XЦ��ǐ6����]�o�3�dN"�P=xL/���������!��<��rK)V'Unr�Mf��P4u8�|��������`���"��2MqPBS��9�3�P�z��^hgq0�����i�1�ؼ�a��L���>U��Z�}:�m+]z�lO3��)Q�e{��ǰG�$�y��������Ϗ�?%Ǔ�7��֫7��ٸ�<i3�9֧qY~C�_H�юt��w��C��0��!< ��&_eֹ��W�j������)��߿�� X��/      ?   �   x����
�@�O1x�`?�,:		bP�U�]l@E�߾����������ÿ?!��7h���|ۤmZ�^�ɘ�� �8B=T�h����@���J�'��p]V\����������a�?���eQ�.����d �8���8�b\�x3�Y�\� ��Y�t�5�V�a�u~��NZ������u{��:O9���Rp�
�/A�>9^O2      I   U  x���Ak�@�����
"]C)�M�����&m%����due]�!��w7�MK"� =�o����N�������R��_(�R<'�=������U�ă�g�A��Le�����u4'����R�hCn�cG��ܑD�����I��YnQM�J�YK��>�����ɼ�9�y�j���8kY����օ��~~)�����?&68q�j�\��1�(|Q�E���f��E�*�פ�~�4wG�_w�ժ:{�}�Ҽ���p8J�QJNC��y��<z��Ϝa������fԽ�ú�u���� ��5��϶�)i��? ;���+�NS3���#)��E�R�      ;   
   x���         