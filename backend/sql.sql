--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: device; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device (
    "deviceUid" VARCHAR(255) NOT NULL,
    "deviceName" VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    "lastSeenDate" timestamp without time zone NOT NULL,
    "registrationDate" timestamp without time zone NOT NULL,
    description VARCHAR(1024) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    "typeId" integer
);


ALTER TABLE public.device OWNER TO postgres;

--
-- Name: device_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_type (
    id integer NOT NULL,
    name VARCHAR(255) NOT NULL
);


ALTER TABLE public.device_type OWNER TO postgres;

--
-- Name: device_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.device_type_id_seq OWNER TO postgres;

--
-- Name: device_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_type_id_seq OWNED BY public.device_type.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name VARCHAR(255) NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: parameter_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parameter_type (
    id integer NOT NULL,
    name VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    threshold1 double precision NOT NULL,
    threshold2 double precision NOT NULL,
    units VARCHAR(255) DEFAULT '°C'::VARCHAR(255) NOT NULL,
    min double precision DEFAULT '0'::double precision NOT NULL,
    max double precision DEFAULT '0'::double precision NOT NULL,
    "measurementsPerMinute" double precision DEFAULT '4'::double precision NOT NULL
);


ALTER TABLE public.parameter_type OWNER TO postgres;

--
-- Name: parameter_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parameter_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parameter_type_id_seq OWNER TO postgres;

--
-- Name: parameter_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parameter_type_id_seq OWNED BY public.parameter_type.id;


--
-- Name: parameter_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parameter_value (
    id integer NOT NULL,
    string VARCHAR(255),
    "typeId" integer,
    "deviceDeviceUid" VARCHAR(255),
    number double precision,
    visibility integer DEFAULT 3 NOT NULL
);


ALTER TABLE public.parameter_value OWNER TO postgres;

--
-- Name: parameter_value_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parameter_value_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parameter_value_id_seq OWNER TO postgres;

--
-- Name: parameter_value_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parameter_value_id_seq OWNED BY public.parameter_value.id;


--
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typeorm_metadata (
    type VARCHAR(255) NOT NULL,
    database VARCHAR(255),
    schema VARCHAR(255),
    "table" VARCHAR(255),
    name VARCHAR(255),
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO postgres;

--
-- Name: device_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_type ALTER COLUMN id SET DEFAULT nextval('public.device_type_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: parameter_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parameter_type ALTER COLUMN id SET DEFAULT nextval('public.parameter_type_id_seq'::regclass);


--
-- Name: parameter_value id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parameter_value ALTER COLUMN id SET DEFAULT nextval('public.parameter_value_id_seq'::regclass);


--
-- Data for Name: device; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.device VALUES ('boiler', 'Boiler', 'static/images/bruli.jpg', '2022-04-10 03:34:48', '2022-04-10 03:34:56', 'Bruli boiler for home use by eSterkovnik', 49.9753169, 16.866098, 1);
INSERT INTO public.device VALUES ('NodeMCU', 'Node MCU', '', '2022-04-23 21:35:13', '2022-04-23 21:35:17', 'Office Node MCU measuring light inside the room using photoreristor', 49.9753169, 16.866098, 2);
INSERT INTO public.device VALUES ('NodeMCU2', 'Soil sensor', '', '2022-04-24 23:32:55', '2022-04-24 23:33:00', 'Node MCU with cheap soil sensor and DHT22', 49.9753169, 16.866098, 3);
INSERT INTO public.device VALUES ('Arduino2', 'Bedroom Arduino', '', '2022-04-23 21:35:13', '2022-04-23 21:35:17', 'Bedroom Arduino UNO measuring light using photoreristor', 49.9753169, 16.866098, 2);
INSERT INTO public.device VALUES ('Arduino', 'Office Arduino', '', '2022-04-23 21:35:13', '2022-04-23 21:35:17', 'Office Arduino Nano measuring light using photoreristor', 49.9753169, 16.866098, 2);


--
-- Data for Name: device_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.device_type VALUES (1, 'Boiler Devices');
INSERT INTO public.device_type VALUES (2, 'Arduinos');
INSERT INTO public.device_type VALUES (3, 'Soil Measurement Devices');


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: parameter_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.parameter_type VALUES (16, 't1_calibration', 'T1 Calibration', 'number', -10, 10, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (11, 'feeder_temperature', 'Feeder Temperature', 'number', 20, 40, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (19, 't2_temperature', 'T2 Temperature', 'number', -100, 100, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (3, 'boiler_calibration', 'Boiler Calibration', 'number', -10, 10, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (15, 'return_temperature', 'Return Temperature', 'number', 10, 60, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (8, 'dhw_calibration', 'DHW Calibration', 'number', -10, 10, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (9, 'dhw_temperature', 'DHW Temperature', 'number', 40, 50, '°C', 10, 100, 1);
INSERT INTO public.parameter_type VALUES (10, 'feeder_calibration', 'Feeder Calibration', 'number', -10, 10, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (20, 'light', 'Light Intensity', 'number', 0, 100, '%', 0, 100, 4);
INSERT INTO public.parameter_type VALUES (21, 'soil', 'Soil Humidity', 'number', 60, 90, '%', 0, 100, 4);
INSERT INTO public.parameter_type VALUES (22, 'temperature', 'DHT22 Temperature', 'number', 20, 25, '°C', -40, 80, 4);
INSERT INTO public.parameter_type VALUES (23, 'humidity', 'DHT22 Humidity', 'number', 40, 60, '% RH', 0, 100, 4);
INSERT INTO public.parameter_type VALUES (24, 'rssi', 'RSSI Signal Strength', 'number', -80, -70, 'dBm', -100, -10, 4);
INSERT INTO public.parameter_type VALUES (4, 'boiler_temperature', 'Boiler Temperature', 'number', 30, 70, '°C', 0, 100, 1);
INSERT INTO public.parameter_type VALUES (5, 'ch1_internal_normalized', 'Normalized Room Temperature', 'number', 18, 25, '°C', -50, 50, 1);
INSERT INTO public.parameter_type VALUES (6, 'ch2_internal_normalized', 'Bedroom Temperature', 'number', 18, 25, '°C', -50, 50, 1);
INSERT INTO public.parameter_type VALUES (18, 't2_calibration', 'T2 Calibration', 'number', -10, 10, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (12, 'indoor_calibration', 'Indoors Temperature', 'number', -10, 10, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (13, 'outside_calibration', 'Outside Calibration', 'number', -10, 10, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (14, 'return_calibration', 'Return Calibration', 'number', -10, 10, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (7, 'ch2_internal_temperature', 'Normalized Bedroom Temperature', 'number', 18, 25, '°C', -50, 50, 1);
INSERT INTO public.parameter_type VALUES (1, 'outside_temperature', 'Outside Temperature', 'number', 0, 10, '°C', -50, 50, 1);
INSERT INTO public.parameter_type VALUES (2, 'ch1_internal_temperature', 'Room Temperature', 'number', 18, 25, '°C', -50, 50, 1);
INSERT INTO public.parameter_type VALUES (17, 't1_temperature', 'T1 Temperature', 'number', -100, 100, '°C', -100, 100, 1);
INSERT INTO public.parameter_type VALUES (25, 'boiler_status', 'Boiler Status', 'number', 0, 0, '', 0, 3, 1);
INSERT INTO public.parameter_type VALUES (26, 'out_pomp1', 'Output Pump 1 Status', 'number', 0, 0, '', 0, 3, 1);


--
-- Data for Name: parameter_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.parameter_value VALUES (3, NULL, 1, 'boiler', 5, 3);
INSERT INTO public.parameter_value VALUES (4, NULL, 2, 'boiler', 22, 3);
INSERT INTO public.parameter_value VALUES (5, NULL, 3, 'boiler', 0.27, 3);
INSERT INTO public.parameter_value VALUES (6, NULL, 4, 'boiler', 34.5, 3);
INSERT INTO public.parameter_value VALUES (7, NULL, 5, 'boiler', 21.1, 3);
INSERT INTO public.parameter_value VALUES (8, NULL, 6, 'boiler', 19.2, 3);
INSERT INTO public.parameter_value VALUES (9, NULL, 7, 'boiler', 21.52, 3);
INSERT INTO public.parameter_value VALUES (10, NULL, 8, 'boiler', 0.89, 3);
INSERT INTO public.parameter_value VALUES (11, NULL, 9, 'boiler', 41.12, 3);
INSERT INTO public.parameter_value VALUES (12, NULL, 10, 'boiler', 1.64, 3);
INSERT INTO public.parameter_value VALUES (13, NULL, 11, 'boiler', 31.07, 3);
INSERT INTO public.parameter_value VALUES (14, NULL, 12, 'boiler', 0, 3);
INSERT INTO public.parameter_value VALUES (15, NULL, 13, 'boiler', -1.8, 3);
INSERT INTO public.parameter_value VALUES (16, NULL, 14, 'boiler', 1.46, 3);
INSERT INTO public.parameter_value VALUES (17, NULL, 15, 'boiler', 31.43, 3);
INSERT INTO public.parameter_value VALUES (18, NULL, 16, 'boiler', 0, 3);
INSERT INTO public.parameter_value VALUES (19, NULL, 17, 'boiler', 31.82, 3);
INSERT INTO public.parameter_value VALUES (20, NULL, 18, 'boiler', 0, 3);
INSERT INTO public.parameter_value VALUES (21, NULL, 19, 'boiler', 21.52, 3);
INSERT INTO public.parameter_value VALUES (22, NULL, 20, 'Arduino', 50, 3);
INSERT INTO public.parameter_value VALUES (23, NULL, 20, 'Arduino2', 50, 3);
INSERT INTO public.parameter_value VALUES (24, NULL, 20, 'NodeMCU', 50, 3);
INSERT INTO public.parameter_value VALUES (25, NULL, 21, 'NodeMCU2', 30, 3);
INSERT INTO public.parameter_value VALUES (26, NULL, 22, 'NodeMCU2', 30, 3);
INSERT INTO public.parameter_value VALUES (27, NULL, 23, 'NodeMCU2', 30, 3);
INSERT INTO public.parameter_value VALUES (28, NULL, 24, 'NodeMCU2', -70, 3);
INSERT INTO public.parameter_value VALUES (29, NULL, 25, 'boiler', 0, 4);
INSERT INTO public.parameter_value VALUES (30, NULL, 26, 'boiler', 0, 4);


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: device_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_type_id_seq', 2, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- Name: parameter_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parameter_type_id_seq', 25, true);


--
-- Name: parameter_value_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parameter_value_id_seq', 28, true);


--
-- Name: parameter_value PK_44821e6332d33d4958ceb24bf93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "PK_44821e6332d33d4958ceb24bf93" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: parameter_type PK_9172edfe1e2548d58309cc2089d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parameter_type
    ADD CONSTRAINT "PK_9172edfe1e2548d58309cc2089d" PRIMARY KEY (id);


--
-- Name: device PK_b97f4d1b3e1ba733d0463013e5b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device
    ADD CONSTRAINT "PK_b97f4d1b3e1ba733d0463013e5b" PRIMARY KEY ("deviceUid");


--
-- Name: device_type PK_f8d1c0daa8abde339c1056535a0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_type
    ADD CONSTRAINT "PK_f8d1c0daa8abde339c1056535a0" PRIMARY KEY (id);


--
-- Name: parameter_value FK_0147def6301bbce380fc1051d27; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "FK_0147def6301bbce380fc1051d27" FOREIGN KEY ("deviceDeviceUid") REFERENCES public.device("deviceUid");


--
-- Name: device FK_1d9d3cdfc95b3b64bcd33f414de; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device
    ADD CONSTRAINT "FK_1d9d3cdfc95b3b64bcd33f414de" FOREIGN KEY ("typeId") REFERENCES public.device_type(id);


--
-- Name: parameter_value FK_e5a4fbd175719accfb774a16ecb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parameter_value
    ADD CONSTRAINT "FK_e5a4fbd175719accfb774a16ecb" FOREIGN KEY ("typeId") REFERENCES public.parameter_type(id);


--
-- PostgreSQL database dump complete
--

