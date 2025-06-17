--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: property_characteristics; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.property_characteristics (uuid, created_at, updated_at, deleted_at, name, type, is_multiple, description) FROM stdin;
9ed598dc-bcf3-432f-9628-1df799170446	2025-05-16 16:59:19.828326	2025-06-01 15:35:24.975714	\N	Водопостачання	3	t	Тип водопостачання на об'єкті нерухомості
f2522e44-9523-47cb-9f37-c40f89b76937	2025-05-17 19:06:49.544537	2025-06-01 15:35:25.816579	\N	Тип кухні	3	f	Тип кухні - студія, окрема
99a04bd2-c137-4ffc-864c-a60db361556a	2025-04-13 14:53:08.11585	2025-06-01 15:35:26.315315	\N	Тип опалення	3	t	Тип опалення у приміщені
cc2fc8ec-ffd0-4a28-891d-145b16e82c48	2025-04-12 21:59:42.886	2025-06-01 15:35:26.726171	\N	Кількість кімнат	1	f	Кількість кімнат у помешкані
535513a5-553a-4e65-ad17-266ab1713d71	2025-05-15 18:36:13.328196	2025-06-01 15:35:26.956731	\N	Кількість поверхів у будинку	1	f	Поверховість будинку
f243e1d6-39cd-407d-8e80-92c90d25af61	2025-05-15 18:32:12.550657	2025-06-01 15:35:27.836226	\N	Житлова площа	1	f	Житлова площа
2dc36907-040d-4a85-8c87-481b991343de	2025-05-15 18:37:25.682621	2025-06-01 15:35:28.047213	\N	Кутове помешкання	4	f	Чи помешкання кутове - Так, Ні.
8656f6df-1d75-4aec-9cab-923ded7f05bb	2025-05-15 20:53:59.348864	2025-06-01 15:35:28.265962	\N	Площа земельної ділянки	1	f	Площа земельної ділянки
7bfb2f27-294f-4d2c-b3e1-e426edb70bc2	2025-05-15 20:03:43.453945	2025-06-01 15:35:28.456282	\N	Тип кімнат	3	f	Тип кімнат: Суміжні, прохідні
2b6574c4-e133-40be-9c8a-6a294f7494a3	2025-04-12 22:08:38.39214	2025-06-01 15:35:28.656363	\N	Балкон/лоджія	4	f	Наявність балкону або лоджії
b7eddfe4-6173-4439-929d-d6f1cfbc3f70	2025-05-17 19:04:47.963891	2025-06-01 15:35:42.356137	2025-06-01 15:35:42.356137	Наявність ліфта	4	f	Наявність ліфта у будинку
0d973796-cc6b-4421-b6bb-c7683b3457fe	2025-05-15 18:31:27.394599	2025-05-29 19:34:52.68383	\N	Загальна площа	1	f	Загальна площа приміщення
ea5f3cb2-c02a-4d4b-b75b-c644049baf32	2025-05-15 18:34:33.682841	2025-05-29 19:34:53.133559	\N	Стан приміщення	2	f	В якому стані приміщення. Чи потребує ремонту
\.


--
-- Data for Name: characteristic_value; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.characteristic_value (uuid, property_characteristic_uuid, value, created_at) FROM stdin;
801a98f6-6349-42ef-9262-217349766d14	99a04bd2-c137-4ffc-864c-a60db361556a	Централізоване	2025-04-26 21:13:12.129814
907457f3-3015-41bb-bcad-87a26b139677	99a04bd2-c137-4ffc-864c-a60db361556a	Електричне	2025-04-26 21:13:36.397966
cc14327b-921d-4c8d-834b-1c6ee755406d	99a04bd2-c137-4ffc-864c-a60db361556a	Автономне газове	2025-04-27 14:05:22.752543
6d3defcc-c8b1-4cae-a8d4-c53f239fd4c6	7bfb2f27-294f-4d2c-b3e1-e426edb70bc2	Суміжні	2025-05-15 20:03:43.654426
38596a37-6649-4639-b111-d328331ad494	7bfb2f27-294f-4d2c-b3e1-e426edb70bc2	Прохідні	2025-05-15 20:03:43.814378
a7a1b802-0c39-4ae6-a244-6901847d9c4d	9ed598dc-bcf3-432f-9628-1df799170446	Центральне	2025-05-16 16:59:20.024303
7d9c2c17-4f7a-428e-ae73-d7d46679cb81	9ed598dc-bcf3-432f-9628-1df799170446	Криниця	2025-05-16 16:59:20.183647
9091d565-ed03-49a8-9feb-dc7a7f2c88d5	9ed598dc-bcf3-432f-9628-1df799170446	Свердловина	2025-05-17 18:58:41.516427
348b80ab-8dbd-4154-981c-3b7883543848	f2522e44-9523-47cb-9f37-c40f89b76937	Студія	2025-05-17 19:07:50.971726
55086aac-ec88-45a6-a578-43d4622bdb25	f2522e44-9523-47cb-9f37-c40f89b76937	Окрема	2025-05-17 19:07:51.13267
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.currencies (uuid, created_at, updated_at, deleted_at, name, code, symbol) FROM stdin;
973b6df8-da71-41c9-a930-9761f0dd4dfd	2025-04-28 19:05:24.468917	2025-06-05 17:42:53.9932	\N	Канадський долар	CAD	$
1bfa66c8-e124-482d-97a7-a965f3ff7b5e	2025-04-01 18:51:04.346523	2025-06-05 17:42:54.566816	\N	Гривня	UAH	₴
8efa312a-f138-4c1c-b00d-43a955e7d72c	2025-04-01 19:08:24.03801	2025-06-05 18:11:36.264281	\N	Євро	EUR	€
4deedf09-b86d-4799-ab10-ae1424471540	2025-04-01 18:52:53.996923	2025-06-03 17:37:03.561585	\N	Долар США	USD	$
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.locations (uuid, created_at, updated_at, deleted_at, community, settlement, district, street, building_number, apartment_number, description, latitude, longitude) FROM stdin;
4117f984-4dfb-4cb5-969f-5c1679c955fb	2025-04-08 19:03:59.630528	2025-04-08 19:03:59.630528	\N	Львівська ОТГ	Львів	Франківський	Бойчука	100-Б	259-П	Вхід через провулок. Поряд школа	49.823322	24.063666
c61b73a8-77ce-486e-b42d-c4c48d713f2a	2025-04-09 16:04:04.31143	2025-04-09 16:04:04.31143	\N	Львівська ОТГ	м. Львів	Личаківський	вул. Лисинецька	15	1	В районі школи	0.000000	0.000000
818c5f6e-673b-4bc0-8690-6d2ba8de86e9	2025-04-09 16:02:27.336	2025-04-11 17:20:48.917116	\N	Львівська ОТГ	Львів	Франківський	Бойчука		255-П	Вхід через провулок. Поряд школа upd	49.813231	23.996074
\.


--
-- Data for Name: property-categories; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public."property-categories" (uuid, created_at, updated_at, deleted_at, name, slug) FROM stdin;
7931fc20-1c68-432b-8a13-26162a2bfd73	2025-04-04 16:34:33.134596	2025-06-03 16:45:50.916132	\N	Земельні ділянки	zemelni-dilyanki
4d203e69-27b1-4ee0-b0d0-42afab465dbf	2025-04-04 16:18:33.491603	2025-06-03 16:45:51.303194	\N	Комерційна нерухомість	komercijna-neruhomist
2d7ce4f9-d673-485f-9d2b-441ae9c5fbe3	2025-04-04 16:34:54.501849	2025-06-05 18:06:50.653226	\N	Спеціалізована нерухомість	specializovana-neruhomist
16c54408-c064-4ad0-8e70-0c138f768b3c	2025-04-04 16:14:24.52796	2025-06-05 18:06:50.953185	\N	Житлова нерухомість	zhitlova-neruhomist
\.


--
-- Data for Name: property-types; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public."property-types" (uuid, created_at, updated_at, deleted_at, name, slug, category_uuid, description) FROM stdin;
65f3017e-1337-4ecc-b19d-d7e2bdf1a979	2025-06-06 16:47:37.61784	2025-06-06 16:48:25.103094	\N	Земельна ділянка с/г призначення	zemelna-dilyanka-sg-priznachennya	7931fc20-1c68-432b-8a13-26162a2bfd73	Земельна ділянка сільсько-господарського (призначення)
8fea394a-7c41-418d-b99d-d26638aed87b	2025-05-08 18:47:32.922138	2025-06-02 19:35:55.466611	\N	Гараж	garazh	2d7ce4f9-d673-485f-9d2b-441ae9c5fbe3	Приміщення для зберігання транспортних засобів.
f959b32f-07b7-45f0-9392-94a7bb6a7b28	2025-04-07 16:50:24.940087	2025-06-02 19:35:55.88617	\N	Земля під житлову забудову	zemlya-pid-zhitlovu-zabudovu	7931fc20-1c68-432b-8a13-26162a2bfd73	Територія, що призначена для забудови
5633655d-14a2-4bea-a3cd-ab165c898e27	2025-05-08 18:50:39.934756	2025-06-02 19:35:56.67687	\N	Готель	gotel	4d203e69-27b1-4ee0-b0d0-42afab465dbf	Будівля, призначена для тимчасового проживання туристів і подорожуючих
398ae2c9-34e8-4d17-9229-ed2c270ef438	2025-04-06 19:31:45.994938	2025-06-02 19:35:57.187167	\N	Офісне приміщення	ofisne-primishennya	4d203e69-27b1-4ee0-b0d0-42afab465dbf	Приміщення, призначене для ведення бізнесу або роботи в офісному середовищі
16ea985e-1099-4f65-9bf7-b9bd89c15fe3	2025-04-06 19:13:23.622174	2025-06-02 19:35:57.705943	\N	Квартира	kvartira	16c54408-c064-4ad0-8e70-0c138f768b3c	Житлове приміщення в багатоквартирному будинку
db798cd1-ed98-4d93-842f-19a3021f63e2	2025-04-07 16:52:51.00573	2025-06-02 19:35:58.105915	\N	Приватний будинок	privatnij-budinok	16c54408-c064-4ad0-8e70-0c138f768b3c	Окремо розташована будівля, що призначена для житлових цілей
0c4e5fa0-caf8-4be9-ab86-9cece8edbc09	2025-05-15 20:40:53.682409	2025-06-02 19:35:59.785312	\N	Апартаменти	apartamenti	16c54408-c064-4ad0-8e70-0c138f768b3c	
e9b2b204-ff79-43ce-b072-af3308072163	2025-05-08 19:04:56.952883	2025-06-02 19:36:11.905814	2025-06-02 19:36:11.905814	Паркомісце	parkomisce	2d7ce4f9-d673-485f-9d2b-441ae9c5fbe3	Паркомісце на паркінгу для зберігання траспорту
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.properties (uuid, created_at, updated_at, deleted_at, title, property_type_uuid, location_uuid, is_published, gallery_uuid) FROM stdin;
0c1f7298-c037-4afb-bb33-f0364de59c70	2025-06-13 18:27:55.261343	2025-06-13 18:53:41.854593	\N	Затишна двокімнатна квартира на Липинського, 10 з видом на парк	16ea985e-1099-4f65-9bf7-b9bd89c15fe3	4117f984-4dfb-4cb5-969f-5c1679c955fb	t	\N
7b6cdbe5-b4f4-446a-a444-ff086321e33b	2025-06-09 18:30:11.457873	2025-06-13 18:55:22.139453	\N	Будинок, вул, Київська	db798cd1-ed98-4d93-842f-19a3021f63e2	818c5f6e-673b-4bc0-8690-6d2ba8de86e9	t	\N
6515d064-e84e-4044-819e-c31e63c3c87b	2025-06-13 18:31:43.15421	2025-06-13 19:26:01.749376	2025-06-13 19:26:01.749376	Гараж, Личаківський район	8fea394a-7c41-418d-b99d-d26638aed87b	c61b73a8-77ce-486e-b42d-c4c48d713f2a	t	\N
\.


--
-- Data for Name: property_characteristic_values; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.property_characteristic_values (uuid, created_at, updated_at, deleted_at, value, property_uuid, property_characteristic_uuid) FROM stdin;
\.


--
-- Data for Name: user_types; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.user_types (uuid, created_at, updated_at, deleted_at, type, title) FROM stdin;
36b17063-dc02-45a7-b7e6-c2616175c9ac	2025-02-20 22:46:40.870548	2025-03-04 20:35:57.702792	\N	agent	Агент з нерухомості
508c8716-feca-4535-879a-8035b9a47824	2025-02-20 22:45:54.979541	2025-03-04 21:02:37.927492	\N	user	Користувач
bf6c1a28-905f-4237-9021-60dda488e1b6	2025-03-05 19:56:38.853699	2025-03-05 19:56:54.840714	\N	company	Компанія
688af835-6dc4-43bf-ba09-bcf7e8fb93b1	2025-03-05 19:57:27.854292	2025-03-28 19:14:52.398652	\N	guest	Гість
0d7078ce-cb8f-43a0-bd5b-9d5250dac538	2025-03-04 21:28:17.799071	2025-03-28 19:18:02.498614	2025-03-28 19:18:02.498614	guestsys	Гість системи
775d83e5-1a24-49e0-9072-56770c858b20	2025-03-28 21:21:07.793808	2025-03-29 17:05:47.022072	\N	agency	Агенство з нерухомості
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.user_roles (uuid, created_at, updated_at, deleted_at, role, title, type_uuid) FROM stdin;
5845c24b-203e-4517-a5e9-61186dda0c41	2025-02-19 22:35:23.439007	2025-02-19 22:35:23.439007	\N	owner	Власник	36b17063-dc02-45a7-b7e6-c2616175c9ac
a63e95cd-488c-43b4-83cc-3b304632729a	2025-02-19 22:50:30.335471	2025-03-12 19:56:00.733776	\N	user	Користувач	508c8716-feca-4535-879a-8035b9a47824
491b4c11-73be-4480-bfc2-5f2dc7ea50af	2025-02-19 22:37:52.027041	2025-03-17 22:28:31.180413	\N	agent	Агент з нерухомості	36b17063-dc02-45a7-b7e6-c2616175c9ac
b10415ea-b718-4bb5-b38a-deedee48a77a	2025-02-19 22:32:24.720009	2025-03-17 22:29:08.597503	\N	admin	Адміністратор	36b17063-dc02-45a7-b7e6-c2616175c9ac
7f264419-3214-43b5-a835-90417ed9d581	2025-03-17 23:21:26.587131	2025-04-27 20:00:15.41373	2025-04-27 20:00:15.41373	agency	Агенство з нерухомості	bf6c1a28-905f-4237-9021-60dda488e1b6
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: db_user
--

COPY public.users (uuid, name, surname, email, password, created_at, updated_at, deleted_at, type_uuid, role_uuid) FROM stdin;
edc3eec2-5952-4d02-976b-b66d3911e9a4	Alice		alice_alic@realestate.com	$argon2id$v=19$m=65536,t=3,p=4$qYCPMGLaO8q/dCisdfMpbw$xpM5P743lDmYbxtY8yLlngkR6KSDog/6/D4DfK7WA7c	2025-02-21 22:56:24.240475	2025-02-21 22:56:24.240475	\N	508c8716-feca-4535-879a-8035b9a47824	a63e95cd-488c-43b4-83cc-3b304632729a
9b788ef9-803d-4a6e-b1f5-6206b2830ca1	Owner	Owner	owner@realestate.com	$argon2id$v=19$m=65536,t=3,p=4$IQ8RugNghURp1A52+ocKtw$6YIjC6F7Jg/LHNU801PbyTQ3zd1/FgrksqkItozEEc0	2025-02-22 00:21:48.142648	2025-02-22 00:21:48.142648	\N	36b17063-dc02-45a7-b7e6-c2616175c9ac	5845c24b-203e-4517-a5e9-61186dda0c41
506d8df7-f227-40d5-a6a4-589c5963f067	Admin	Admin	admin@realestate.com	$argon2id$v=19$m=65536,t=3,p=4$u3MZU01yCgweIMcTCWKZGw$Mju+kidBnat06yR9YS8KMRCaAaG3/aimHJAr0S55j9I	2025-02-22 00:23:24.259567	2025-02-22 00:23:24.259567	\N	36b17063-dc02-45a7-b7e6-c2616175c9ac	b10415ea-b718-4bb5-b38a-deedee48a77a
b147b210-4c6d-417f-8198-8347eb50f9ab	Lana	Del Ray	lana.del_ray@realestate.com	$argon2id$v=19$m=65536,t=3,p=4$PK8gbLzfzx37l/oGyEYZQw$rV+EyN8vIfxM2fVaPdkb6sT9ymfn9A75kY2jT/MNAz8	2025-02-22 00:25:23.721155	2025-02-22 00:25:23.721155	\N	36b17063-dc02-45a7-b7e6-c2616175c9ac	491b4c11-73be-4480-bfc2-5f2dc7ea50af
5d7b3851-bd56-43a0-9a60-49995bd42605	Met	Methew	met@realestate.com	$argon2id$v=19$m=65536,t=3,p=4$YGav3yRra3iUeoJovTZUow$6Z8pZxTeCH6a0YVESCBLoNEQ2HZUgRU4yWj+yL2fipE	2025-02-22 00:27:04.145723	2025-02-22 17:07:51.847117	2025-02-22 17:07:51.847117	508c8716-feca-4535-879a-8035b9a47824	a63e95cd-488c-43b4-83cc-3b304632729a
c70ad697-2435-4c82-8a1a-2133ed9e6b11	Dilan	Duck	dilan@realestate.com	$argon2id$v=19$m=65536,t=3,p=4$/UpoVLaF9BaRz5tif2VAHA$Iokv2Z71hvRsrsgzvjtFzyTIqS4Se5rm2Ihkwby5o3I	2025-02-22 00:26:18.638618	2025-02-24 20:21:37.417741	\N	508c8716-feca-4535-879a-8035b9a47824	a63e95cd-488c-43b4-83cc-3b304632729a
ba078d2e-2c5e-4407-be1e-6270de1a4cd9	Met	Methew	met@realestate.com	$argon2id$v=19$m=65536,t=3,p=4$s38CCuOcoT6A9XuL1Gk8pQ$TYqVWmdmrid+gD0T2ePFkE8Lh0pgsTyABnQbxt4xf2Q	2025-03-24 18:19:45.995936	2025-03-24 18:19:45.995936	\N	508c8716-feca-4535-879a-8035b9a47824	a63e95cd-488c-43b4-83cc-3b304632729a
\.


--
-- PostgreSQL database dump complete
--

